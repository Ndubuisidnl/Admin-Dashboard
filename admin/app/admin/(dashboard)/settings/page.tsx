import React from "react";
import { getAdminProfileAction } from "@/lib/actions/settings";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const instant = false;

export default async function AdminSettingsPage() {
  const profile = await getAdminProfileAction();

  return <SettingsClient initialProfile={profile} />;
}
