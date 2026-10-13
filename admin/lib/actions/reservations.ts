"use server";

import { createClient } from "@/lib/supabase/server";
import { Reservation, ReservationStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

// SUPABASE: Fetch reservations with optional status & date filtering
export async function getReservationsAction(
  status?: string,
  date?: string
): Promise<{ reservations: Reservation[]; error?: string }> {
  const supabase = await createClient();

  let query = supabase
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: true })
    .order("reservation_time", { ascending: true });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (date) {
    query = query.eq("reservation_date", date);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching reservations:", error.message);
    return { reservations: [], error: error.message };
  }

  return { reservations: (data as Reservation[]) || [] };
}

// SUPABASE: Update reservation status (pending -> confirmed -> completed/cancelled)
export async function updateReservationStatusAction(
  id: string,
  newStatus: ReservationStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reservations")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (error) {
    return { error: `Failed to update reservation: ${error.message}` };
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  return { success: true };
}

// SUPABASE: Create manual staff table reservation (No WhatsApp field)
export async function createReservationServerSideAction(formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const guest_count = parseInt(formData.get("guest_count") as string, 10);
  const occasion = (formData.get("occasion") as string) || null;
  const special_requests = (formData.get("special_requests") as string) || null;

  if (!full_name || !email || !phone || !date || !time || isNaN(guest_count)) {
    return { error: "Please fill in all required reservation fields." };
  }

  const { error } = await supabase.from("reservations").insert({
    full_name,
    email,
    phone,
    reservation_date: date,
    reservation_time: time,
    guest_count,
    occasion,
    special_requests,
    status: "confirmed", // Staff created bookings default to confirmed
  });

  if (error) {
    return { error: `Failed to create reservation: ${error.message}` };
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/admin");
  return { success: true };
}
