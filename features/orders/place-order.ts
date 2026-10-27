import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { ingredients, menuItems, orderItems, orders, recipeLines } from "@/db/schema";
import type { PlaceOrderInput } from "@/lib/schemas";

export class OrderRejectedError extends Error {
  constructor(
    message: string,
    readonly code: "UNKNOWN_ITEM" | "UNAVAILABLE_ITEM" | "INSUFFICIENT_STOCK",
  ) {
    super(message);
  }
}

/** Inserts the order and decrements ingredient stock in a single transaction. */
export async function placeOrder(input: PlaceOrderInput): Promise<{ orderId: string }> {
  const menuIds = [...new Set(input.items.map((i) => i.menuItemId))];

  return getDb().transaction(async (tx) => {
    const menu = await tx.select().from(menuItems).where(inArray(menuItems.id, menuIds));
    if (menu.length !== menuIds.length) throw new OrderRejectedError("Order contains an unknown menu item", "UNKNOWN_ITEM");
    const unavailable = menu.find((m) => !m.available);
    if (unavailable) throw new OrderRejectedError(`${unavailable.name} is unavailable`, "UNAVAILABLE_ITEM");

    const lines = await tx.select().from(recipeLines).where(inArray(recipeLines.menuItemId, menuIds));
    const ordered = new Map<string, number>();
    for (const item of input.items) ordered.set(item.menuItemId, (ordered.get(item.menuItemId) ?? 0) + item.quantity);

    const needed = new Map<string, number>();
    for (const line of lines) {
      needed.set(line.ingredientId, (needed.get(line.ingredientId) ?? 0) + line.quantity * (ordered.get(line.menuItemId) ?? 0));
    }

    // Fixed lock order (by id) so concurrent orders cannot deadlock on each other.
    for (const [ingredientId, amount] of [...needed].sort(([a], [b]) => a.localeCompare(b))) {
      const updated = await tx
        .update(ingredients)
        .set({ stock: sql`${ingredients.stock} - ${amount}` })
        .where(and(eq(ingredients.id, ingredientId), gte(ingredients.stock, amount)))
        .returning({ id: ingredients.id });
      if (updated.length === 0) {
        const [row] = await tx.select({ name: ingredients.name }).from(ingredients).where(eq(ingredients.id, ingredientId));
        throw new OrderRejectedError(`Not enough ${row?.name ?? "stock"} for this order`, "INSUFFICIENT_STOCK");
      }
    }

    const [order] = await tx.insert(orders).values({ tableId: input.tableId }).returning({ id: orders.id });
    await tx.insert(orderItems).values(input.items.map((i) => ({ ...i, orderId: order.id })));
    return { orderId: order.id };
  });
}
