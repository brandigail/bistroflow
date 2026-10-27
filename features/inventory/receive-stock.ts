import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { ingredients } from "@/db/schema";
import type { ReceiveStockInput } from "@/lib/schemas";

export class UnknownIngredientError extends Error {
  constructor() {
    super("Delivery contains an unknown ingredient");
  }
}

/** Adds a delivery to stock. All lines apply together or none do. */
export async function receiveStock(input: ReceiveStockInput): Promise<void> {
  // Fixed lock order (by id), the same rule the order service follows, so the two can never deadlock.
  const lines = [...input.items].sort((a, b) => a.ingredientId.localeCompare(b.ingredientId));

  await getDb().transaction(async (tx) => {
    for (const line of lines) {
      const updated = await tx
        .update(ingredients)
        .set({ stock: sql`${ingredients.stock} + ${line.quantity}` })
        .where(eq(ingredients.id, line.ingredientId))
        .returning({ id: ingredients.id });
      if (updated.length === 0) throw new UnknownIngredientError();
    }
  });
}
