import { eq, inArray, ne, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { ingredients, menuItems, orderItems, orders, tables } from "@/db/schema";
import type { Table, TicketStatus } from "@/types";

const URGENCY: TicketStatus[] = ["READY", "PREPARING", "NEW", "SERVED", "PAID"];

export interface TableWithState extends Table {
  /** Status of the table's open order, or null when the table is free. */
  orderStatus: TicketStatus | null;
}

export async function getTablesWithState(): Promise<TableWithState[]> {
  const db = getDb();
  const [allTables, openOrders] = await Promise.all([
    db.select().from(tables).orderBy(tables.y, tables.x),
    db.select({ tableId: orders.tableId, status: orders.status }).from(orders).where(ne(orders.status, "PAID")),
  ]);
  // A table can have several open orders; show the one that needs attention first.
  const statusByTable = new Map<string, TicketStatus>();
  for (const { tableId, status } of openOrders) {
    const current = statusByTable.get(tableId);
    if (!current || URGENCY.indexOf(status) < URGENCY.indexOf(current)) statusByTable.set(tableId, status);
  }
  return allTables.map((t) => ({ ...t, orderStatus: statusByTable.get(t.id) ?? null }));
}

export interface FloorStats {
  totalTables: number;
  openTables: number;
  kitchenTickets: number;
  /** Value of everything ordered but not yet paid, in whole currency units. */
  openTabs: number;
  lowStock: number;
}

export async function getFloorStats(): Promise<FloorStats> {
  const db = getDb();
  const [[tableCount], [open], [kitchen], [tabs], [low]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(tables),
    db.select({ n: sql<number>`count(distinct ${orders.tableId})::int` }).from(orders).where(ne(orders.status, "PAID")),
    db.select({ n: sql<number>`count(*)::int` }).from(orders).where(inArray(orders.status, ["NEW", "PREPARING", "READY"])),
    db
      .select({ cents: sql<number>`coalesce(sum(${menuItems.priceCents} * ${orderItems.quantity}), 0)::int` })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(ne(orders.status, "PAID")),
    db.select({ n: sql<number>`count(*)::int` }).from(ingredients).where(sql`${ingredients.stock} <= ${ingredients.reorderLevel}`),
  ]);
  return {
    totalTables: tableCount.n,
    openTables: open.n,
    kitchenTickets: kitchen.n,
    openTabs: tabs.cents / 100,
    lowStock: low.n,
  };
}
