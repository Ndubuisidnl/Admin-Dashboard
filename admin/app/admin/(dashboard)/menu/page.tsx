import React from "react";
import { getMenuItemsAction } from "@/lib/actions/menu";
import { MenuManagerClient } from "@/components/admin/MenuManagerClient";

export const instant = false;

export default async function AdminMenuPage() {
  const items = await getMenuItemsAction();

  return <MenuManagerClient initialItems={items} />;
}
