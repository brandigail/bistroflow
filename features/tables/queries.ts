import { ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, tables } from "@/db/schema";
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
