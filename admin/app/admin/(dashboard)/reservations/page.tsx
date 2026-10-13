import React from "react";
import { getReservationsAction } from "@/lib/actions/reservations";
import { ReservationsManagerClient } from "@/components/admin/ReservationsManagerClient";

export const instant = false;

export default async function AdminReservationsPage() {
  const result = await getReservationsAction();

  return <ReservationsManagerClient initialReservations={result.reservations} initialError={result.error} />;
}
