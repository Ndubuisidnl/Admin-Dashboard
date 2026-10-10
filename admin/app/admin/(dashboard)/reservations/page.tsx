import React from "react";
import { getReservationsAction } from "@/lib/actions/reservations";
import { ReservationsManagerClient } from "@/components/admin/ReservationsManagerClient";

export const instant = false;

export default async function AdminReservationsPage() {
  const reservations = await getReservationsAction();

  return <ReservationsManagerClient initialReservations={reservations} />;
}
