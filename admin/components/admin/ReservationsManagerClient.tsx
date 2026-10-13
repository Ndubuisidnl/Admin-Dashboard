"use client";

import React, { useState, useTransition } from "react";
import { Reservation, ReservationStatus } from "@/lib/types";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Users,
  Phone,
  Mail,
  Plus,
  CheckCircle,
  XCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  updateReservationStatusAction,
  createReservationServerSideAction,
} from "@/lib/actions/reservations";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const reservationStatuses: { label: string; value: ReservationStatus | "all" }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

interface ReservationsManagerClientProps {
  initialReservations: Reservation[];
  initialError?: string;
}

export function ReservationsManagerClient({
  initialReservations,
  initialError,
}: ReservationsManagerClientProps) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter reservations
  const filteredReservations = reservations.filter((res) => {
    const matchesStatus =
      selectedStatus === "all" || res.status === selectedStatus;
    const matchesDate = !selectedDate || res.reservation_date === selectedDate;
    return matchesStatus && matchesDate;
  });

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    startTransition(async () => {
      const res = await updateReservationStatusAction(id, newStatus);
      if (res.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createReservationServerSideAction(formData);
      if (res.error) {
        setFormError(res.error);
      } else {
        setIsModalOpen(false);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-wood">
            Table Reservations Management
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Review table requests, manage guest seatings, and record phone reservations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Date Picker Filter */}
          <div className="flex items-center space-x-2 bg-cream px-3 py-1.5 rounded-xl border border-border-warm text-xs text-text-dark">
            <CalendarIcon className="w-4 h-4 text-warm-brown" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-text-muted hover:text-dark-wood font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* New Reservation Button */}
          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Table Booking</span>
          </button>
        </div>
      </div>

      {initialError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          Could not load reservations from Supabase: {initialError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {reservationStatuses.map((st) => (
          <button
            key={st.value}
            onClick={() => setSelectedStatus(st.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === st.value
                ? "bg-dark-wood text-light-caramel shadow-xs"
                : "bg-warm-white text-text-muted hover:bg-cream-card hover:text-dark-wood border border-border-warm"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-16 p-8">
            <CalendarIcon className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-serif font-bold text-dark-wood">
              No table reservations found
            </h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              {selectedDate
                ? `No table bookings found for ${selectedDate}.`
                : "No table requests match the current status filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-card border-b border-border-warm text-text-muted uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-6">Guest Info</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Party Size</th>
                  <th className="py-3.5 px-6">Occasion & Notes</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm/60">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-cream/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-dark-wood text-sm">
                        {res.full_name}
                      </div>
                      <div className="text-[11px] text-text-muted space-y-0.5 mt-0.5">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-warm-amber" />
                          <span>{res.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-warm-amber" />
                          <span>{res.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-dark-wood">
                        {new Date(res.reservation_date).toLocaleDateString("en-NG", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-warm-brown font-semibold flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{res.reservation_time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cream-card text-dark-wood font-semibold border border-border-warm">
                        <Users className="w-3.5 h-3.5 text-warm-brown" />
                        <span>{res.guest_count} Guests</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      {res.occasion && (
                        <div className="font-semibold text-warm-brown capitalize flex items-center space-x-1 text-[11px]">
                          <Sparkles className="w-3 h-3" />
                          <span>{res.occasion}</span>
                        </div>
                      )}
                      {res.special_requests ? (
                        <div className="text-text-muted italic text-[11px] mt-0.5 line-clamp-2">
                          "{res.special_requests}"
                        </div>
                      ) : (
                        <span className="text-text-muted/60 text-[10px]">— No special notes —</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={res.status} type="reservation" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {res.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "confirmed")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Confirm</span>
                          </button>
                        )}
                        {res.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "completed")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-lg text-xs transition-colors"
                          >
                            Mark Seated
                          </button>
                        )}
                        {res.status !== "cancelled" && res.status !== "completed" && (
                          <button
                            onClick={() => handleStatusChange(res.id, "cancelled")}
                            disabled={isPending}
                            className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Table Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-warm-white rounded-2xl shadow-2xl max-w-lg w-full border border-border-warm overflow-hidden">
            <div className="p-6 bg-espresso text-light-caramel border-b border-warm-amber/20 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                Record Walk-in / Phone Reservation
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-cream-card/70 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium">
                  {formError}
                </div>
              )}

              {/* Guest Name */}
              <div>
                <label className="block font-semibold text-text-dark mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  required
                  placeholder="Sarah Johnson"
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="+234 800 000 0000"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="sarah@example.com"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Date, Time, Guest Count */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Party Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="guest_count"
                    required
                    defaultValue="2"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Occasion & Requests */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Occasion (Optional)
                  </label>
                  <input
                    type="text"
                    name="occasion"
                    placeholder="Birthday, Anniversary..."
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Special Seating Requests
                  </label>
                  <input
                    type="text"
                    name="special_requests"
                    placeholder="Window table, High chair..."
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-border-warm flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-cream hover:bg-cream-card rounded-lg text-xs font-semibold text-text-dark border border-border-warm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold rounded-lg text-xs shadow-xs flex items-center space-x-2"
                >
                  {isPending && <LoadingSpinner size="sm" className="border-dark-wood" />}
                  <span>Confirm Table Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
