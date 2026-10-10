import React from "react";
import { verifyAdminSession } from "@/lib/dal/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SERVER-SIDE SECURITY CHECK LAYER 2:
  // Verifies authentic admin token and database profiles.role === 'admin'
  const admin = await verifyAdminSession();

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader adminName={admin.full_name} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
