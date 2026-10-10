"use server";

import { createClient } from "@/lib/supabase/server";
import { Order, OrderStatus, OrderCreationInput } from "@/lib/types";
import { revalidatePath } from "next/cache";

// SUPABASE: Fetch all orders with items and snapshot data
export async function getOrdersAction(
  status?: string,
  search?: string
): Promise<Order[]> {
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(`order_number.ilike.${s},full_name.ilike.${s},phone.ilike.${s}`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }

  return (data as Order[]) || [];
}

// SUPABASE: Fetch single order by ID
export async function getOrderByIdAction(id: string): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(*)
    `)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Order;
}

// SUPABASE: Update order status (with automatic timestamp update)
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: `Failed to update status: ${error.message}` };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true };
}

// SUPABASE & SERVER SECURITY: Secure server-side order creation
// Crucial: Prices, subtotals, delivery fees, and order numbers are generated SERVER-SIDE ONLY.
export async function createOrderServerSideAction(input: OrderCreationInput) {
  const supabase = await createClient();

  if (!input.items || input.items.length === 0) {
    return { error: "Order must contain at least one item." };
  }

  // 1. Fetch real menu item records from database to ensure trusted pricing
  const itemIds = input.items.map((i) => i.menu_item_id);
  const { data: dbMenuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, price, category, available, image_label")
    .in("id", itemIds);

  if (menuError || !dbMenuItems) {
    return { error: "Failed to validate order menu items." };
  }

  const menuMap = new Map(dbMenuItems.map((item) => [item.id, item]));

  // 2. Validate availability and calculate trusted subtotal
  let subtotal = 0;
  const orderItemsToInsert = [];

  for (const itemInput of input.items) {
    const menuItem = menuMap.get(itemInput.menu_item_id);
    if (!menuItem) {
      return { error: `Item ID ${itemInput.menu_item_id} no longer exists.` };
    }
    if (!menuItem.available) {
      return { error: `"${menuItem.name}" is currently out of stock.` };
    }

    const unitPrice = Number(menuItem.price);
    const lineTotal = unitPrice * itemInput.quantity;
    subtotal += lineTotal;

    orderItemsToInsert.push({
      menu_item_id: menuItem.id,
      menu_item_snapshot: {
        id: menuItem.id,
        name: menuItem.name,
        price: unitPrice,
        category: menuItem.category,
        image_label: menuItem.image_label,
      },
      quantity: itemInput.quantity,
      unit_price: unitPrice,
      special_instructions: itemInput.special_instructions || null,
    });
  }

  // 3. Determine delivery fee (Server configured)
  const deliveryFee = input.order_type === "delivery" ? 1500 : 0;
  const total = subtotal + deliveryFee;

  // 4. Generate server-side sequential order number
  const timestamp = Date.now().toString().slice(-4);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const orderNumber = `WH-${timestamp}${randomSuffix}`;

  // 5. Insert order record
  const { data: newOrder, error: orderInsertError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: input.user_id || null,
      full_name: input.full_name,
      phone: input.phone,
      email: input.email,
      order_type: input.order_type,
      payment_method: input.payment_method,
      delivery_address: input.delivery_address ? (input.delivery_address as any) : null,
      general_note: input.general_note || null,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: "received",
    })
    .select()
    .single();

  if (orderInsertError || !newOrder) {
    return { error: `Failed to create order: ${orderInsertError?.message}` };
  }

  // 6. Insert order item snapshots
  const itemsWithOrderId = orderItemsToInsert.map((item) => ({
    ...item,
    order_id: newOrder.id,
  }));

  const { error: itemsInsertError } = await supabase
    .from("order_items")
    .insert(itemsWithOrderId);

  if (itemsInsertError) {
    return { error: `Order created, but items insert failed: ${itemsInsertError.message}` };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return { success: true, order: newOrder };
}
