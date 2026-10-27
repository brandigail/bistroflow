import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { menuItems, orderItems, orders } from "@/db/schema";
import type { Bill, BillLine } from "@/types";

/** Everything unpaid on a table, merged into one bill. Prices are summed in cents. */
export async function getTableBill(tableId: string): Promise<Bill> {
  const rows = await getDb()
    .select({
      menuItemId: menuItems.id,
      name: menuItems.name,
      priceCents: menuItems.priceCents,
      quantity: orderItems.quantity,
      status: orders.status,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(and(eq(orders.tableId, tableId), ne(orders.status, "PAID")));

  const byItem = new Map<string, BillLine & { cents: number }>();
  for (const r of rows) {
    const line = byItem.get(r.menuItemId) ?? { name: r.name, quantity: 0, unitPrice: r.priceCents / 100, lineTotal: 0, cents: 0 };
    line.quantity += r.quantity;
    line.cents += r.priceCents * r.quantity;
    line.lineTotal = line.cents / 100;
    byItem.set(r.menuItemId, line);
  }

  const lines = [...byItem.values()].map((l) => ({
    name: l.name,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    lineTotal: l.lineTotal,
  }));
  const totalCents = [...byItem.values()].reduce((sum, l) => sum + l.cents, 0);
  const kitchenPending = rows.some((r) => r.status === "NEW" || r.status === "PREPARING");

  return { lines, total: totalCents / 100, kitchenPending };
}
