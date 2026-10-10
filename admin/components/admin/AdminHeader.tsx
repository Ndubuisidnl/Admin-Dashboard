import React from "react";
import { UserCheck, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  adminName: string;
  title?: string;
  description?: string;
}

export function AdminHeader({
  adminName,
  title,
  description,
}: AdminHeaderProps) {
  return (
    <header className="bg-warm-white border-b border-border-warm px-8 py-4 flex items-center justify-between shadow-xs">
      <div>
        {title ? (
          <h1 className="text-2xl font-serif font-bold text-dark-wood">
            {title}
          </h1>
        ) : (
          <h1 className="text-2xl font-serif font-bold text-dark-wood">
            Welcome back, {adminName}
          </h1>
        )}
        {description ? (
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        ) : (
          <p className="text-xs text-text-muted mt-0.5">
            Real-time management for Wood House Cafe orders, reservations & menu
          </p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Admin User Badge */}
        <div className="flex items-center space-x-2 bg-cream-card px-3 py-1.5 rounded-full border border-border-warm">
          <div className="w-7 h-7 rounded-full bg-warm-amber text-dark-wood flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-dark-wood block leading-tight">
              {adminName}
            </span>
            <span className="text-[10px] text-warm-brown font-medium block leading-none">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
