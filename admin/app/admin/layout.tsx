import React from "react";

// Pass-through wrapper for /admin sub-routes.
// Auth checks are enforced in app/admin/(dashboard)/layout.tsx for dashboard routes only,
// keeping /admin/login free from layout-level auth checks to avoid redirect loops.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
