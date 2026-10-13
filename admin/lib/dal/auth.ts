import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin";
}

// SUPABASE: Server-side Data Access Layer for Admin Authorization
// Enforces mandatory 2-step verification: auth.users identity check + profiles.role check
export async function verifyAdminSession(): Promise<AdminUser> {
  const supabase = await createClient();

  // 1. Authenticate user token against Supabase Auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // 2. Fetch user profile and verify admin role from database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    // Non-admin user or profile missing — deny access
    redirect("/admin/login?error=unauthorized");
  }

  return {
    id: profile.id,
    email: user.email || "",
    full_name: profile.full_name || "Admin",
    role: "admin",
  };
}
