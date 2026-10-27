import { ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, tables } from "@/db/schema";
import type { Table, TicketStatus } from "@/types";

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
  const statusByTable = new Map(openOrders.map((o) => [o.tableId, o.status]));
  return allTables.map((t) => ({ ...t, orderStatus: statusByTable.get(t.id) ?? null }));
}
