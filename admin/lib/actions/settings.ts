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

  return profile as Profile | null;
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
