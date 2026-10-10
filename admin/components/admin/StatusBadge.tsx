import React from "react";
import { OrderStatus, ReservationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: OrderStatus | ReservationStatus | string;
  type?: "order" | "reservation";
}

export function StatusBadge({ status, type = "order" }: StatusBadgeProps) {
  let badgeStyles = "bg-gray-100 text-gray-800 border-gray-200";
  let label = status;

  if (type === "order") {
    switch (status as OrderStatus) {
      case "received":
        badgeStyles = "bg-blue-50 text-blue-800 border-blue-200";
        label = "Received";
        break;
      case "preparing":
        badgeStyles = "bg-amber-50 text-amber-800 border-amber-200 animate-pulse";
        label = "Preparing";
        break;
      case "ready":
        badgeStyles = "bg-purple-50 text-purple-800 border-purple-200";
        label = "Ready";
        break;
      case "out-for-delivery":
        badgeStyles = "bg-indigo-50 text-indigo-800 border-indigo-200";
        label = "Out for Delivery";
        break;
      case "collected":
        badgeStyles = "bg-emerald-50 text-emerald-800 border-emerald-200";
        label = "Collected / Delivered";
        break;
      case "cancelled":
        badgeStyles = "bg-red-50 text-red-800 border-red-200";
        label = "Cancelled";
        break;
    }
  } else {
    switch (status as ReservationStatus) {
      case "pending":
        badgeStyles = "bg-amber-50 text-amber-800 border-amber-200";
        label = "Pending";
        break;
      case "confirmed":
        badgeStyles = "bg-emerald-50 text-emerald-800 border-emerald-200";
        label = "Confirmed";
        break;
      case "completed":
        badgeStyles = "bg-gray-100 text-gray-700 border-gray-200";
        label = "Completed";
        break;
      case "cancelled":
        badgeStyles = "bg-red-50 text-red-800 border-red-200";
        label = "Cancelled";
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyles}`}
    >
      {label}
    </span>
  );
}
