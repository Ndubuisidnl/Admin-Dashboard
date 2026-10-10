import React, { Suspense } from "react";
import { Coffee } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const instant = false;

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-dark-wood flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-warm-white rounded-2xl shadow-2xl border border-espresso overflow-hidden">
        {/* Brand Banner */}
        <div className="bg-espresso p-8 text-center border-b border-warm-amber/20 relative">
          <div className="w-16 h-16 bg-warm-amber text-dark-wood rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Coffee className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-light-caramel">
            Wood House Cafe
          </h1>
          <p className="text-xs text-cream-card/70 mt-1 uppercase tracking-wider font-semibold">
            Private Staff Administration
          </p>
        </div>

        {/* Suspense Boundary for Client Form Component */}
        <Suspense
          fallback={
            <div className="p-12 text-center">
              <LoadingSpinner size="md" />
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>

        {/* Footer Note */}
        <div className="bg-cream-card/50 p-4 border-t border-border-warm text-center">
          <p className="text-[11px] text-text-muted">
            Authorized personnel only. Customer access is on the primary website.
          </p>
        </div>
      </div>
    </div>
  );
}
