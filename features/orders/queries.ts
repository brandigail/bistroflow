import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { menuItems, orderItems, orders, tables } from "@/db/schema";
import type { KitchenOrder } from "@/types";

const ACTIVE_STATUSES = ["NEW", "PREPARING", "READY"] as const;

/** Tickets the kitchen still has to deal with, oldest first. */
export async function getActiveOrders(): Promise<KitchenOrder[]> {
  const db = getDb();
  const rows = await db
    .select({ id: orders.id, status: orders.status, createdAt: orders.createdAt, tableLabel: tables.label })
    .from(orders)
    .innerJoin(tables, eq(orders.tableId, tables.id))
    .where(inArray(orders.status, [...ACTIVE_STATUSES]))
    .orderBy(asc(orders.createdAt));
  if (rows.length === 0) return [];

  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      name: menuItems.name,
      quantity: orderItems.quantity,
      notes: orderItems.notes,
    })
    .from(orderItems)
    .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)));

  return rows.map((r) => ({
    id: r.id,
    tableLabel: r.tableLabel,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    items: items
      .filter((i) => i.orderId === r.id)
      .map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, notes: i.notes })),
  }));
}
