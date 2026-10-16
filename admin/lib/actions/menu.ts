"use server";

import { createClient } from "@/lib/supabase/server";
import { MenuItem, MenuCategory } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cafeMenu } from "@/lib/menu-data";

// SUPABASE: Fetch menu items with optional category filtering and search query
export async function getMenuItemsAction(
  category?: string,
  search?: string
): Promise<MenuItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (search && search.trim()) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching menu items:", error.message);
    return [];
  }

  return ((data || []).map((item) => ({
    ...item,
    image_url: item.image,
    preparation_time: item.preparation_time,
  })) as MenuItem[]);
}

// Add the photographed reference menu to the shared menu catalog. Existing names
// are left untouched so running the import again is safe.
export async function importReferenceMenuAction() {
  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("menu_items")
    .select("name");

  if (readError) return { error: `Could not check the current menu: ${readError.message}` };

  const existingNames = new Set((existing || []).map((item) => item.name.trim().toLocaleLowerCase()));
  const categoryBySection: Record<string, MenuCategory> = {
    breakfast: "breakfast",
    starters: "snacks",
    sides: "rice",
    salads: "snacks",
    mains: "main-dishes",
    pasta: "pasta",
    sandwiches: "sandwiches",
    burgers: "burgers",
    "coffee-tea": "coffee",
    drinks: "drinks",
  };

  const rows = cafeMenu.flatMap((section) => section.items
    .filter((item) => Number.isInteger(item.price) && !existingNames.has(item.name.trim().toLocaleLowerCase()))
    .map((item) => ({
      name: item.name,
      description: item.description || "",
      price: item.price!,
      category: categoryBySection[section.id],
      image_label: "",
      image: null,
      available: true,
      featured: false,
      tags: [],
      preparation_time: null,
      is_active: true,
    })));

  const pricedItemCount = cafeMenu.reduce((count, section) => count + section.items.filter((item) => Number.isInteger(item.price)).length, 0);
  const skipped = pricedItemCount - rows.length;
  if (rows.length === 0) return { success: true, added: 0, skipped };

  const { error } = await supabase.from("menu_items").insert(rows);
  if (error) return { error: `Could not import the reference menu: ${error.message}` };

  revalidatePath("/admin/menu");
  return { success: true, added: rows.length, skipped };
}

// SUPABASE: Create new menu item (price validated server-side)
export async function createMenuItemAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as MenuCategory;
  const image_label = (formData.get("image_label") as string) || "";
  const available = formData.get("available") === "true";
  const featured = formData.get("featured") === "true";
  const preparationTimeRaw = formData.get("preparation_time") as string;
  const preparation_time = preparationTimeRaw ? Number(preparationTimeRaw) : null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!name || !description || !Number.isInteger(price) || price < 0 || !category ||
      (preparation_time !== null && (!Number.isInteger(preparation_time) || preparation_time <= 0))) {
    return { error: "Please fill in all required menu item fields correctly." };
  }

  const { error } = await supabase.from("menu_items").insert({
    name,
    description,
    price,
    category,
    image_label,
    image: (formData.get("image_url") as string) || null,
    available,
    featured,
    tags,
    preparation_time,
    is_active: true,
  });

  if (error) {
    return { error: `Failed to create menu item: ${error.message}` };
  }

  revalidatePath("/admin/menu");
  return { success: true };
}

// SUPABASE: Update existing menu item
export async function updateMenuItemAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as MenuCategory;
  const image_label = (formData.get("image_label") as string) || "";
  const available = formData.get("available") === "true";
  const featured = formData.get("featured") === "true";
  const preparationTimeRaw = formData.get("preparation_time") as string;
  const preparation_time = preparationTimeRaw ? Number(preparationTimeRaw) : null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!name || !description || !Number.isInteger(price) || price < 0 || !category ||
      (preparation_time !== null && (!Number.isInteger(preparation_time) || preparation_time <= 0))) {
    return { error: "Please fill in all required menu item fields correctly." };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      name,
      description,
      price,
      category,
      image_label,
      image: (formData.get("image_url") as string) || null,
      available,
      featured,
      tags,
      preparation_time,
      is_active: formData.get("is_active") !== "false",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: `Failed to update menu item: ${error.message}` };
  }

  revalidatePath("/admin/menu");
  return { success: true };
}

// SUPABASE: Toggle item availability (Out of Stock / Available)
export async function toggleMenuItemAvailabilityAction(
  id: string,
  currentAvailable: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({
      available: !currentAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: `Failed to toggle availability: ${error.message}` };
  }

  revalidatePath("/admin/menu");
  return { success: true };
}

// Hide a menu item from the customer site while preserving order history.
export async function deleteMenuItemAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({ is_active: false, available: false })
    .eq("id", id);

  if (error) {
    return { error: `Failed to archive menu item: ${error.message}` };
  }

  revalidatePath("/admin/menu");
  return { success: true };
}
