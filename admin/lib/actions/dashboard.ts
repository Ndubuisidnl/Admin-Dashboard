"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/lib/types";

// SUPABASE: Fetch aggregated metrics and recent data for Admin Overview
export async function getDashboardStatsAction(): Promise<DashboardStats> {
  const supabase = await createClient();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayIso = startOfDay.toISOString();

  // 1. Fetch Today's Completed/Valid Orders & Revenue
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total, status")
    .gte("created_at", startOfDayIso);

  let todayRevenue = 0;
  let todayOrdersCount = 0;

  if (todayOrders) {
    todayOrdersCount = todayOrders.length;
    todayRevenue = todayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }

  // 2. Count Pending Reservations
  const { count: pendingReservationsCount } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 3. Count Unread Messages
  const { count: contactMessagesCount } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true });

  // 4. Fetch 5 Most Recent Orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // 5. Fetch Today's Reservations
  const todayDateString = new Date().toISOString().split("T")[0];
  const { data: todayReservations } = await supabase
    .from("reservations")
    .select("*")
    .eq("reservation_date", todayDateString)
    .order("reservation_time", { ascending: true })
    .limit(10);

  return {
    todayRevenue,
    todayOrdersCount,
    pendingReservationsCount: pendingReservationsCount || 0,
    unreadMessagesCount: contactMessagesCount || 0,
    recentOrders: (recentOrders as any) || [],
    todayReservations: (todayReservations || []).map((row) => ({
      ...row,
      date: row.reservation_date,
      time: row.reservation_time,
      reservation_date: row.reservation_date,
      reservation_time: row.reservation_time,
    })) as any,
  };
}
