"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  Mail,
  Settings,
  LogOut,
  Coffee,
} from "lucide-react";
import { signOutAdminAction } from "@/lib/actions/auth";

const navItems = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Reservations",
    href: "/admin/reservations",
    icon: Calendar,
  },
  {
    name: "Menu Items",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark-wood text-warm-white flex flex-col min-h-screen border-r border-espresso shadow-lg shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-espresso/60 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-warm-amber flex items-center justify-center text-dark-wood font-bold shadow-md">
          <Coffee className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-lg leading-tight text-light-caramel">
            Wood House Cafe
          </h1>
          <p className="text-xs text-text-muted">Staff Administration</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-warm-amber text-dark-wood font-semibold shadow-sm"
                  : "text-cream-card/80 hover:bg-espresso hover:text-light-caramel"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Staff Sign Out Footer */}
      <div className="p-4 border-t border-espresso/60">
        <form action={signOutAdminAction}>
          <button
            type="submit"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
