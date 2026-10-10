"use client";

import React, { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { signInAdminAction, AuthActionResult } from "@/lib/actions/auth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState<
    AuthActionResult | null,
    FormData
  >(signInAdminAction, null);

  let bannerError = state?.error;
  if (!bannerError && errorParam === "unauthorized") {
    bannerError =
      "Access denied. Your account does not have administrator privileges.";
  } else if (!bannerError && errorParam === "auth_callback_failed") {
    bannerError = "Authentication failed. Please try logging in again.";
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-serif font-semibold text-dark-wood mb-2">
        Staff Portal Sign In
      </h2>
      <p className="text-xs text-text-muted mb-6">
        Enter your authorized staff credentials to manage orders, reservations, and menu.
      </p>

      {bannerError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div className="leading-relaxed font-medium">{bannerError}</div>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1.5">
            Staff Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              required
              placeholder="admin@woodhousecafe.com"
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-border-warm rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-warm-amber focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold text-text-dark mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-cream border border-border-warm rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-warm-amber focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-warm-amber hover:bg-warm-amber-hover text-dark-wood font-semibold text-sm rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" className="border-dark-wood" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to Admin Dashboard</span>
          )}
        </button>
      </form>
    </div>
  );
}
