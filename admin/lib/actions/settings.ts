"use server";

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types";
import { revalidatePath } from "next/cache";

// SUPABASE: Fetch current admin profile details
export async function getAdminProfileAction(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? ({ ...profile, email: user.email || null } as Profile) : null;
}

export async function getRestaurantSettingsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("delivery_fee")
    .eq("id", true)
    .single();
  if (error) return { delivery_fee: null };
  return data;
}

export async function updateDeliveryFeeAction(formData: FormData) {
  const supabase = await createClient();
  const rawFee = formData.get("delivery_fee");
  const fee = Number(rawFee);
  if (typeof rawFee !== "string" || rawFee.trim() === "" || !Number.isInteger(fee) || fee < 0) return { error: "Enter a valid non-negative delivery fee." };
  const { error } = await supabase.from("restaurant_settings").update({
    delivery_fee: fee,
    updated_at: new Date().toISOString(),
  }).eq("id", true);
  if (error) return { error: `Failed to update delivery fee: ${error.message}` };
  revalidatePath("/admin/settings");
  return { success: true };
}

// SUPABASE: Update admin profile
export async function updateAdminProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  if (!full_name) {
    return { error: "Full name is required." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: `Failed to update profile: ${error.message}` };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin");
  return { success: true };
}
