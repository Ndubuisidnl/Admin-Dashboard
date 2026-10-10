import React from "react";
import { getOrdersAction } from "@/lib/actions/orders";
import { getMenuItemsAction } from "@/lib/actions/menu";
import { OrdersManagerClient } from "@/components/admin/OrdersManagerClient";

export const instant = false;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const [orders, menuItems] = await Promise.all([
    getOrdersAction(),
    getMenuItemsAction(),
  ]);

  return (
    <OrdersManagerClient
      initialOrders={orders}
      availableMenuItems={menuItems.filter((i) => i.available)}
      initialSelectedId={resolvedParams.id}
    />
  );
}
