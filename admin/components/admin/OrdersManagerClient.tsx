"use client";

import React, { useState, useTransition } from "react";
import { Order, OrderStatus, MenuItem } from "@/lib/types";
import {
  Search,
  Filter,
  Eye,
  Plus,
  Clock,
  MapPin,
  Phone,
  Mail,
  Printer,
  ShoppingBag,
  User,
  CheckCircle,
} from "lucide-react";
import {
  updateOrderStatusAction,
  createOrderServerSideAction,
} from "@/lib/actions/orders";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const orderStatuses: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Orders", value: "all" },
  { label: "Received", value: "received" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Ready for Pickup", value: "ready-for-pickup" },
  { label: "Out for Delivery", value: "out-for-delivery" },
  { label: "Collected / Delivered", value: "collected" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

interface OrdersManagerClientProps {
  initialOrders: Order[];
  availableMenuItems: MenuItem[];
  initialSelectedId?: string;
}

export function OrdersManagerClient({
  initialOrders,
  availableMenuItems,
  initialSelectedId,
}: OrdersManagerClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Selected Order Detail Drawer State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    initialOrders.find((o) => o.id === initialSelectedId) || null
  );

  // Manual Order Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormError, setCreateFormError] = useState<string | null>(null);
  const [manualItems, setManualItems] = useState<
    { menu_item_id: string; quantity: number; special_instructions: string }[]
  >([]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const s = searchQuery.toLowerCase();
    const matchesSearch =
      order.order_number.toLowerCase().includes(s) ||
      order.full_name.toLowerCase().includes(s) ||
      order.phone.toLowerCase().includes(s);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    });
  };

  const handleAddItemToManualOrder = (menuItemId: string) => {
    if (!menuItemId) return;
    setManualItems((prev) => {
      const existing = prev.find((i) => i.menu_item_id === menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        { menu_item_id: menuItemId, quantity: 1, special_instructions: "" },
      ];
    });
  };

  const handleManualOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateFormError(null);
    if (manualItems.length === 0) {
      setCreateFormError("Please add at least one item to the order.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const order_type = formData.get("order_type") as "pickup" | "delivery";

    const payload = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      order_type,
      payment_method: formData.get("payment_method") as "pay-on-delivery" | "pay-on-pickup" | "pay-at-restaurant",
      general_note: (formData.get("general_note") as string) || null,
      delivery_address:
        order_type === "delivery"
          ? {
              address: formData.get("address") as string,
              city: (formData.get("city") as string) || "Port Harcourt",
              phone: formData.get("phone") as string,
            }
          : null,
      items: manualItems,
    };

    startTransition(async () => {
      const res = await createOrderServerSideAction(payload);
      if (res.error) {
        setCreateFormError(res.error);
      } else {
        setIsCreateModalOpen(false);
        setManualItems([]);
        window.location.reload();
      }
    });
  };

  const handlePrintKitchenTicket = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-wood">
            Kitchen & Delivery Orders
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor incoming orders, update kitchen preparation stages, and record manual walk-ins.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order #, Name, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-xl text-xs text-text-dark focus:outline-none focus:ring-2 focus:ring-warm-amber w-64"
            />
          </div>

          {/* New Manual Order Button */}
          <button
            onClick={() => {
              setCreateFormError(null);
              setManualItems([]);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Staff Order</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {orderStatuses.map((st) => (
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

      {/* Orders Table Container */}
      <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 p-8">
            <ShoppingBag className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-serif font-bold text-dark-wood">
              No orders found
            </h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No orders match "${searchQuery}".`
                : "No customer orders recorded in this category yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-card border-b border-border-warm text-text-muted uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer Details</th>
                  <th className="py-3.5 px-6">Type & Payment</th>
                  <th className="py-3.5 px-6">Total (₦)</th>
                  <th className="py-3.5 px-6">Date / Time</th>
                  <th className="py-3.5 px-6">Status Stage</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm/60">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-cream/60 transition-colors ${
                      selectedOrder?.id === order.id ? "bg-cream-card/60 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-mono font-bold text-dark-wood">
                      {order.order_number}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-dark-wood">
                        {order.full_name}
                      </div>
                      <div className="text-[11px] text-text-muted flex items-center space-x-2 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{order.phone}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="capitalize font-semibold text-warm-brown">
                        {order.order_type}
                      </div>
                      <div className="text-[10px] text-text-muted uppercase tracking-wider font-mono">
                        {order.payment_method}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-dark-wood text-sm">
                      ₦{Number(order.total).toLocaleString("en-NG")}
                    </td>
                    <td className="py-4 px-6 text-text-muted text-[11px]">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      {/* Status Dropdown Controller */}
                      <select
                        value={order.status}
                        disabled={isPending}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cream border border-border-warm text-dark-wood focus:outline-none focus:ring-2 focus:ring-warm-amber cursor-pointer"
                      >
                        <option value="received">Received</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="out-for-delivery">Out for Delivery</option>
                        <option value="collected">Collected / Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-warm-amber/20 hover:bg-warm-amber text-dark-wood font-semibold rounded-lg transition-colors flex items-center space-x-1 ml-auto text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Items</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Order View Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
          <div className="bg-warm-white w-full max-w-lg h-full border-l border-border-warm shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-espresso text-light-caramel flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-warm-amber tracking-wider font-bold">
                  Kitchen Ticket Details
                </span>
                <h3 className="font-serif font-bold text-xl leading-tight">
                  Order {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-cream-card/70 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Printable & Scrollable Order Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs" id="printable-ticket">
              {/* Customer & Order Metadata Box */}
              <div className="bg-cream p-4 rounded-xl border border-border-warm space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-border-warm/60">
                  <span className="font-bold text-dark-wood flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-warm-brown" />
                    <span>{selectedOrder.full_name}</span>
                  </span>
                  <StatusBadge status={selectedOrder.status} type="order" />
                </div>
                <div className="text-text-muted space-y-1 pt-1">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-warm-amber" />
                    <span>{selectedOrder.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-warm-amber" />
                    <span>{selectedOrder.email}</span>
                  </div>
                  {selectedOrder.delivery_address && (
                    <div className="flex items-start space-x-2 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-warm-amber shrink-0 mt-0.5" />
                      <span>
                        {selectedOrder.delivery_address.address},{" "}
                        {selectedOrder.delivery_address.city}
                      </span>
                    </div>
                  )}
                  {selectedOrder.general_note && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 font-medium italic">
                      Note: "{selectedOrder.general_note}"
                    </div>
                  )}
                </div>
              </div>

              {/* Itemized Order Line Items Table */}
              <div>
                <h4 className="font-serif font-bold text-sm text-dark-wood mb-3">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-border-warm/80 border border-border-warm rounded-xl bg-warm-white overflow-hidden">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-dark-wood text-xs flex items-center space-x-2">
                          <span className="w-5 h-5 rounded bg-warm-amber text-dark-wood flex items-center justify-center font-mono text-[11px]">
                            {item.quantity}x
                          </span>
                          <span>
                            {item.menu_item_snapshot?.name || "Menu Item"}
                          </span>
                        </div>
                        {item.special_instructions && (
                          <p className="text-[11px] text-amber-800 italic pl-7">
                            Instructions: {item.special_instructions}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-semibold text-dark-wood">
                        ₦{(Number(item.unit_price) * item.quantity).toLocaleString("en-NG")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-cream-card p-4 rounded-xl border border-border-warm space-y-2 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark-wood">
                    ₦{Number(selectedOrder.subtotal).toLocaleString("en-NG")}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-dark-wood">
                    ₦{Number(selectedOrder.delivery_fee).toLocaleString("en-NG")}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-dark-wood pt-2 border-t border-border-warm">
                  <span>Total Paid</span>
                  <span className="text-warm-amber">
                    ₦{Number(selectedOrder.total).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Controls */}
            <div className="p-4 bg-cream border-t border-border-warm flex items-center justify-between">
              <button
                onClick={handlePrintKitchenTicket}
                className="px-4 py-2 bg-warm-white hover:bg-cream-card text-text-dark font-semibold rounded-lg border border-border-warm transition-colors flex items-center space-x-1.5 text-xs"
              >
                <Printer className="w-4 h-4 text-warm-brown" />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-dark-wood hover:bg-espresso text-light-caramel font-semibold rounded-lg transition-colors text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Staff Order Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-warm-white rounded-2xl shadow-2xl max-w-2xl w-full border border-border-warm overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-espresso text-light-caramel border-b border-warm-amber/20 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                Record Staff Phone / Walk-in Order
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-cream-card/70 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleManualOrderSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"
            >
              {createFormError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium">
                  {createFormError}
                </div>
              )}

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    placeholder="John Doe"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="customer@example.com"
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Order Type *
                  </label>
                  <select
                    name="order_type"
                    required
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  >
                    <option value="pickup">Dine-in / Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-dark mb-1">
                    Payment Method *
                  </label>
                  <select
                    name="payment_method"
                    required
                    className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                  >
                    <option value="pay-on-delivery">Pay on Delivery</option>
                    <option value="pay-on-pickup">Pay on Pickup</option>
                    <option value="pay-at-restaurant">Pay at Restaurant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-dark mb-1">
                  Delivery Address (If Delivery)
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address, Area, Port Harcourt"
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>

              {/* Menu Item Picker */}
              <div className="pt-2 border-t border-border-warm">
                <label className="block font-semibold text-text-dark mb-1">
                  Add Dishes to Order *
                </label>
                <select
                  onChange={(e) => {
                    handleAddItemToManualOrder(e.target.value);
                    e.target.value = "";
                  }}
                  className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                >
                  <option value="">-- Select a dish from menu --</option>
                  {availableMenuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — ₦{Number(item.price).toLocaleString("en-NG")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Added Line Items List */}
              {manualItems.length > 0 && (
                <div className="space-y-2 border border-border-warm rounded-lg p-3 bg-cream/40">
                  <span className="font-semibold text-dark-wood block">
                    Selected Items ({manualItems.length}):
                  </span>
                  {manualItems.map((mi) => {
                    const dish = availableMenuItems.find(
                      (m) => m.id === mi.menu_item_id
                    );
                    return (
                      <div
                        key={mi.menu_item_id}
                        className="flex items-center justify-between text-xs bg-warm-white p-2 rounded border border-border-warm"
                      >
                        <span className="font-semibold text-dark-wood">
                          {dish?.name || "Dish"}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() =>
                                setManualItems((prev) =>
                                  prev.map((i) =>
                                    i.menu_item_id === mi.menu_item_id
                                      ? {
                                          ...i,
                                          quantity: Math.max(1, i.quantity - 1),
                                        }
                                      : i
                                  )
                                )
                              }
                              className="px-2 py-0.5 bg-cream border rounded font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 font-mono font-bold">
                              {mi.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setManualItems((prev) =>
                                  prev.map((i) =>
                                    i.menu_item_id === mi.menu_item_id
                                      ? { ...i, quantity: i.quantity + 1 }
                                      : i
                                  )
                                )
                              }
                              className="px-2 py-0.5 bg-cream border rounded font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setManualItems((prev) =>
                                prev.filter(
                                  (i) => i.menu_item_id !== mi.menu_item_id
                                )
                              )
                            }
                            className="text-red-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border-warm flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
                  <span>Submit Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
