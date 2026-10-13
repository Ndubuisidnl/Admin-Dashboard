import React from "react";
import { getAdminProfileAction, getRestaurantSettingsAction } from "@/lib/actions/settings";
import { SettingsClient } from "@/components/admin/SettingsClient";

export const instant = false;

export default async function AdminSettingsPage() {
  const [profile, restaurantSettings] = await Promise.all([getAdminProfileAction(), getRestaurantSettingsAction()]);

  return <SettingsClient initialProfile={profile} initialDeliveryFee={restaurantSettings.delivery_fee} />;
}
