import { and, eq, inArray, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";

export type PayResult = "ok" | "nothing_to_pay" | "kitchen_busy";

/**
 * Mock payment: marks every open order on the table as PAID, which also frees the table
 * (the floor map only counts unpaid orders). Refuses while the kitchen is still cooking.
 */
export async function payTable(tableId: string): Promise<PayResult> {
  return getDb().transaction(async (tx) => {
    const open = await tx
      .select({ id: orders.id, status: orders.status })
      .from(orders)
      .where(and(eq(orders.tableId, tableId), ne(orders.status, "PAID")))
      .for("update");
    if (open.length === 0) return "nothing_to_pay";
    if (open.some((o) => o.status === "NEW" || o.status === "PREPARING")) return "kitchen_busy";

    await tx
      .update(orders)
      .set({ status: "PAID" })
      .where(inArray(orders.id, open.map((o) => o.id)));
    return "ok";
  });
}
