import React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  Mail,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getDashboardStatsAction } from "@/lib/actions/dashboard";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const instant = false;

export default async function AdminDashboardOverviewPage() {
  let stats;
  try {
    stats = await getDashboardStatsAction();
  } catch (error) {
    stats = {
      todayRevenue: 0,
      todayOrdersCount: 0,
      pendingReservationsCount: 0,
      unreadMessagesCount: 0,
      recentOrders: [],
      todayReservations: [],
    };
  }

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1: Revenue */}
        <div className="bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Today's Revenue
            </p>
            <h3 className="text-2xl font-bold text-dark-wood mt-1">
              ₦{stats.todayRevenue.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              From non-cancelled orders today
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-warm-amber flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Stat Card 2: Today's Orders */}
        <div className="bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Today's Orders
            </p>
            <h3 className="text-2xl font-bold text-dark-wood mt-1">
              {stats.todayOrdersCount}
            </h3>
            <p className="text-[11px] text-text-muted mt-1">
              Total orders received today
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Stat Card 3: Pending Reservations */}
        <div className="bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Pending Reservations
            </p>
            <h3 className="text-2xl font-bold text-dark-wood mt-1">
              {stats.pendingReservationsCount}
            </h3>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Requires confirmation
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Stat Card 4: Unread Messages */}
        <div className="bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Contact Messages
            </p>
            <h3 className="text-2xl font-bold text-dark-wood mt-1">
              {stats.unreadMessagesCount}
            </h3>
            <p className="text-[11px] text-text-muted mt-1">
              Customer inquiries
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="bg-cream-card p-4 rounded-xl border border-border-warm flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-dark-wood uppercase tracking-wider">
          Quick Management Actions:
        </span>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/menu?action=new"
            className="px-4 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-warm-white hover:bg-cream text-text-dark font-semibold text-xs rounded-lg border border-border-warm transition-colors flex items-center space-x-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-warm-brown" />
            <span>View All Orders</span>
          </Link>
          <Link
            href="/admin/reservations"
            className="px-4 py-2 bg-warm-white hover:bg-cream text-text-dark font-semibold text-xs rounded-lg border border-border-warm transition-colors flex items-center space-x-1.5"
          >
            <Calendar className="w-4 h-4 text-warm-brown" />
            <span>Manage Reservations</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Today's Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-dark-wood">
                Recent Customer Orders
              </h2>
              <p className="text-xs text-text-muted">
                Latest orders requiring kitchen or delivery updates
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-warm-brown hover:text-warm-amber flex items-center space-x-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-warm rounded-xl bg-cream-card/30">
              <ShoppingBag className="w-10 h-10 text-text-muted mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-dark-wood">
                No orders recorded yet
              </p>
              <p className="text-xs text-text-muted mt-1">
                New customer orders placed on the website will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-warm text-text-muted uppercase text-[10px] tracking-wider bg-cream-card/50">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm/60">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-dark-wood">
                        {order.order_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-dark-wood">
                          {order.full_name}
                        </div>
                        <div className="text-[10px] text-text-muted">
                          {order.phone}
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-warm-brown">
                        {order.order_type}
                      </td>
                      <td className="py-3 px-4 font-bold text-dark-wood">
                        ₦{Number(order.total).toLocaleString("en-NG")}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders?id=${order.id}`}
                          className="text-xs font-semibold text-warm-amber hover:underline"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Today's Reservations (1 col) */}
        <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-dark-wood">
                Today's Bookings
              </h2>
              <p className="text-xs text-text-muted">
                Dine-in table reservations for today
              </p>
            </div>
            <Link
              href="/admin/reservations"
              className="text-xs font-semibold text-warm-brown hover:text-warm-amber flex items-center space-x-1 transition-colors"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.todayReservations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-border-warm rounded-xl bg-cream-card/30 text-center">
              <Calendar className="w-10 h-10 text-text-muted mb-2 opacity-50" />
              <p className="text-sm font-semibold text-dark-wood">
                No reservations for today
              </p>
              <p className="text-xs text-text-muted mt-1 max-w-[200px]">
                Upcoming table requests will be listed here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
              {stats.todayReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-cream border border-border-warm/80 flex items-start justify-between hover:border-warm-amber transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-dark-wood">
                        {res.full_name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cream-card text-warm-brown font-mono font-bold">
                        {res.guest_count} Guests
                      </span>
                    </div>
                    <div className="text-[11px] text-text-muted flex items-center space-x-2">
                      <span className="flex items-center space-x-1 font-medium">
                        <Clock className="w-3 h-3 text-warm-amber" />
                        <span>{res.reservation_time}</span>
                      </span>
                      {res.occasion && (
                        <span className="capitalize text-warm-brown">
                          • {res.occasion}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={res.status} type="reservation" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
