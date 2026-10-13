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

  return ((data || []).map(normalizeOrder) as Order[]);
}

function normalizeOrder(row: any): Order {
  return {
    ...row,
    delivery_address: row.delivery_address
      ? typeof row.delivery_address === "string"
        ? { address: row.delivery_address, landmark: row.delivery_landmark || "" }
        : row.delivery_address
      : null,
    items: (row.items || []).map((item: any) => ({
      ...item,
      menu_item_snapshot: {
        id: item.menu_item_id || item.id,
        name: item.item_name,
        price: item.unit_price,
        category: "",
      },
    })),
  };
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
  return normalizeOrder(data);
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
    })
    .eq("id", orderId);

  if (error) {
    return { error: `Failed to update status: ${error.message}` };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true };
}

// Orders are placed by the customer site through the trusted place_order RPC.
export async function createOrderServerSideAction(input: OrderCreationInput) {
  const supabase = await createClient();
  const ids = input.items.map((item) => item.menu_item_id);
  const { data: menu, error: menuError } = await supabase
    .from("menu_items")
    .select("id, price")
    .in("id", ids);
  if (menuError || !menu) return { error: "Could not load current menu prices." };
  const prices = new Map(menu.map((item) => [item.id, item.price]));
  const { data, error } = await supabase.rpc("place_order", {
    p_full_name: input.full_name,
    p_email: input.email,
    p_phone: input.phone,
    p_order_type: input.order_type,
    p_delivery_address: input.delivery_address?.address || null,
    p_delivery_landmark: input.delivery_address?.landmark || null,
    p_payment_method: input.payment_method,
    p_general_note: input.general_note || "",
    p_items: input.items.map((item) => ({
      ...item,
      selected_unit_price: prices.get(item.menu_item_id),
    })),
  });
  if (error) return { error: `Failed to create order: ${error.message}` };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true, order: data?.[0] };
}
