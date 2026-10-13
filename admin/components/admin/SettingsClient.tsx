"use client";

import React, { useState, useTransition } from "react";
import { Profile } from "@/lib/types";
import {
  User,
  Store,
  Database,
  Save,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  DollarSign,
} from "lucide-react";
import { updateAdminProfileAction, updateDeliveryFeeAction } from "@/lib/actions/settings";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface SettingsClientProps {
  initialProfile: Profile | null;
  initialDeliveryFee: number | null;
}

export function SettingsClient({ initialProfile, initialDeliveryFee }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "restaurant" | "database">("profile");
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isPending, startTransition] = useTransition();

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Store operational state (local editable settings)
  const [deliveryFee, setDeliveryFee] = useState(String(initialDeliveryFee ?? ""));
  const [openingHours, setOpeningHours] = useState("8:00 AM – 10:00 PM (Daily)");
  const [storePhone, setStorePhone] = useState("+234 812 345 6789");
  const [storeAddress, setStoreAddress] = useState("Wood House Cafe, Port Harcourt, Rivers State");

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateAdminProfileAction(formData);
      if (res.error) {
        setFormError(res.error);
      } else {
        setFormSuccess("Admin profile updated successfully.");
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                full_name: formData.get("full_name") as string,
                phone: formData.get("phone") as string,
              }
            : null
        );
      }
    });
  };

  const handleStoreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);
    const formData = new FormData();
    formData.set("delivery_fee", deliveryFee);
    startTransition(async () => {
      const result = await updateDeliveryFeeAction(formData);
      if (result.error) setFormError(result.error);
      else setFormSuccess("Delivery fee saved to the shared restaurant settings.");
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-warm-white p-6 rounded-2xl border border-border-warm shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-wood">
            Portal & Restaurant Settings
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Configure your staff profile, store operating defaults, and database connection.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 bg-cream p-1 rounded-xl border border-border-warm text-xs">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "profile"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Staff Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("restaurant")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "restaurant"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Store Defaults</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "database"
                ? "bg-warm-amber text-dark-wood shadow-xs"
                : "text-text-muted hover:text-dark-wood"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Setup</span>
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{formSuccess}</span>
        </div>
      )}

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
          {formError}
        </div>
      )}

      {/* Tab 1: Staff Profile */}
      {activeTab === "profile" && (
        <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6 max-w-2xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-border-warm">
            <div className="w-12 h-12 rounded-full bg-warm-amber text-dark-wood flex items-center justify-center font-bold text-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-dark-wood">
                Administrator Credentials
              </h3>
              <p className="text-xs text-text-muted">
                Your profile information as displayed on staff orders and audits.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                required
                defaultValue={profile?.full_name || "Admin Staff"}
                className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Email Address (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={profile?.email || "admin@woodhousecafe.com"}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-xs cursor-not-allowed"
              />
              <p className="text-[10px] text-text-muted mt-1">
                Email addresses can only be changed via Supabase Auth admin console.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={profile?.phone || ""}
                placeholder="+234 800 000 0000"
                className="w-full px-3 py-2 bg-cream border border-border-warm rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Assigned Staff Role
              </label>
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="capitalize">{profile?.role || "admin"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-warm flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold rounded-lg text-xs shadow-xs flex items-center space-x-2"
              >
                {isPending ? (
                  <LoadingSpinner size="sm" className="border-dark-wood" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Store Operational Defaults */}
      {activeTab === "restaurant" && (
        <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6 max-w-2xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-border-warm">
            <div className="w-12 h-12 rounded-full bg-cream-card text-warm-brown flex items-center justify-center font-bold text-lg border border-border-warm">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-dark-wood">
                Wood House Cafe Defaults
              </h3>
              <p className="text-xs text-text-muted">
                The delivery fee is shared with checkout through restaurant_settings.
              </p>
            </div>
          </div>

          <form onSubmit={handleStoreSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Standard Delivery Fee (₦)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <p className="text-[10px] text-text-muted mt-1">
                Applied automatically to all server-calculated delivery orders.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Opening Hours (not stored in the shared database)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Restaurant Support Line (not stored in the shared database)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text-dark mb-1">
                Cafe Location Address (not stored in the shared database)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-cream border border-border-warm rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border-warm flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold rounded-lg text-xs shadow-xs flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Delivery Fee</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Database & SQL Migration Guide */}
      {activeTab === "database" && (
        <div className="bg-warm-white rounded-2xl border border-border-warm shadow-xs p-6 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-border-warm">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-dark-wood">
                Supabase Backend Configuration Guide
              </h3>
              <p className="text-xs text-text-muted">
                Step-by-step instructions to connect your shared database for Wood House Cafe.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-cream rounded-xl border border-border-warm space-y-3">
              <h4 className="font-bold text-dark-wood text-sm flex items-center space-x-2">
                <span>Step 1: Apply the Restaurant Database Migrations</span>
              </h4>
              <p className="text-text-muted leading-relaxed">
                Open the shared Supabase project's SQL Editor and run the restaurant project's initial schema migration, followed by the role migration:
              </p>
              <div className="p-3 bg-dark-wood text-light-caramel rounded-lg font-mono text-[11px] select-all overflow-x-auto">
                supabase/migrations/202610070001_initial_schema.sql<br />supabase/migrations/202610130001_profiles_role.sql<br />supabase/migrations/202610140001_menu_image_storage.sql<br />supabase/migrations/202610140002_menu_image_upload_policy.sql<br />supabase/migrations/202610140003_admin_menu_item_permissions.sql<br />supabase/migrations/202610140004_admin_reservation_access.sql
              </div>
              <p className="text-[11px] text-text-muted">
                Apply the restaurant project's initial schema migration, then its role, menu image storage, and admin access migrations. These migrations create the public `menu-images` bucket and grant admin profiles access to menu editing and reservation management.
              </p>
            </div>

            <div className="p-4 bg-cream rounded-xl border border-border-warm space-y-3">
              <h4 className="font-bold text-dark-wood text-sm">
                Step 2: Assign Admin Role to Staff Account
              </h4>
              <p className="text-text-muted leading-relaxed">
                After signing up your staff email account in Supabase Auth, run this query in the SQL Editor to grant admin privileges:
              </p>
              <div className="p-3 bg-dark-wood text-light-caramel rounded-lg font-mono text-[11px] select-all">
                UPDATE public.profiles p SET role = 'admin' FROM auth.users u WHERE p.id = u.id AND u.email = 'your-staff-email@example.com';
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-900 text-xs">
                Security Architecture Confirmation:
              </h4>
              <ul className="list-disc pl-4 text-amber-800 space-y-1 text-[11px]">
                <li>Proxy optimistic session checks protect `/admin/*` routes (`proxy.ts`).</li>
                <li>Admin pages and sign-in verify the shared `profiles.role = 'admin'` value.</li>
                <li>Supabase Row Level Security policies check the admin role for protected database operations.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
