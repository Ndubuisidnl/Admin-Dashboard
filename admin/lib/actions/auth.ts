"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  error?: string;
  success?: boolean;
}

// SUPABASE: Admin Sign In Action with double-tier verification
export async function signInAdminAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createClient();

  // 1. Authenticate credentials against Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Invalid email or password." };
  }

  // 2. Database Role Authorization Check
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    // Immediately sign out unauthorized user from Supabase session
    await supabase.auth.signOut();
    return {
      error: "Access denied. Only registered staff administrators can access this portal.",
    };
  }

  // Redirect to admin overview page
  redirect("/admin");
}

// SUPABASE: Admin Sign Out Action
export async function signOutAdminAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
