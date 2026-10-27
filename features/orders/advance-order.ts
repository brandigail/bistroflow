import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import type { TicketStatus } from "@/types";
import { previousStatus } from "./transitions";

export type AdvanceResult = "ok" | "not_found" | "invalid_transition";

/** Compare-and-set: succeeds only if the order is still in the status that precedes `target`. */
export async function advanceOrder(orderId: string, target: TicketStatus): Promise<AdvanceResult> {
  const from = previousStatus(target);
  if (!from) return "invalid_transition";

  const db = getDb();
  const updated = await db
    .update(orders)
    .set({ status: target })
    .where(and(eq(orders.id, orderId), eq(orders.status, from)))
    .returning({ id: orders.id });
  if (updated.length > 0) return "ok";

  const [exists] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, orderId)).limit(1);
  return exists ? "invalid_transition" : "not_found";
}
