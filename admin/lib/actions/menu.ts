"use server";

import { createClient } from "@/lib/supabase/server";
import { MenuItem, MenuCategory } from "@/lib/types";
import { revalidatePath } from "next/cache";

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

  return (data as MenuItem[]) || [];
}

// SUPABASE: Create new menu item (price validated server-side)
export async function createMenuItemAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const priceSecondaryRaw = formData.get("price_secondary") as string;
  const price_secondary = priceSecondaryRaw ? parseFloat(priceSecondaryRaw) : null;
  const price_display = (formData.get("price_display") as string) || null;
  const category = formData.get("category") as MenuCategory;
  const image_label = (formData.get("image_label") as string) || null;
  const available = formData.get("available") === "true";
  const featured = formData.get("featured") === "true";
  const preparation_time = (formData.get("preparation_time") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!name || !description || isNaN(price) || !category) {
    return { error: "Please fill in all required menu item fields correctly." };
  }

  const { error } = await supabase.from("menu_items").insert({
    name,
    description,
    price,
    price_secondary,
    price_display,
    category,
    image_label,
    available,
    featured,
    tags,
    preparation_time,
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
  const priceSecondaryRaw = formData.get("price_secondary") as string;
  const price_secondary = priceSecondaryRaw ? parseFloat(priceSecondaryRaw) : null;
  const price_display = (formData.get("price_display") as string) || null;
  const category = formData.get("category") as MenuCategory;
  const image_label = (formData.get("image_label") as string) || null;
  const available = formData.get("available") === "true";
  const featured = formData.get("featured") === "true";
  const preparation_time = (formData.get("preparation_time") as string) || null;
  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!name || !description || isNaN(price) || !category) {
    return { error: "Please fill in all required menu item fields correctly." };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      name,
      description,
      price,
      price_secondary,
      price_display,
      category,
      image_label,
      available,
      featured,
      tags,
      preparation_time,
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

// SUPABASE: Delete menu item permanently
export async function deleteMenuItemAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    return { error: `Failed to delete menu item: ${error.message}` };
  }

  revalidatePath("/admin/menu");
  return { success: true };
}
