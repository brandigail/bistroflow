import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ingredients, menuItems, recipeLines } from "@/db/schema";
import type { Ingredient } from "@/types";
import { suggestedOrder } from "./reorder";

export type StockLevel = "OUT" | "LOW" | "OK";

export interface InventoryRow extends Ingredient {
  level: StockLevel;
  /** 0..1 fill for the stock bar, where 1 = three times the reorder level. */
  fill: number;
  /** Dishes whose recipe uses this ingredient, so a shortage can be traced to what it affects. */
  usedIn: string[];
  /** Quantity worth ordering to get back to the target level. */
  suggestedQty: number;
}

export function stockLevel(item: Ingredient): StockLevel {
  if (item.stock <= 0) return "OUT";
  return item.stock <= item.reorderLevel ? "LOW" : "OK";
}

/** Every ingredient, most urgent first (lowest stock relative to its reorder level). */
export async function getInventory(): Promise<InventoryRow[]> {
  const db = getDb();
  const [rows, uses] = await Promise.all([
    db.select().from(ingredients),
    db
      .select({ ingredientId: recipeLines.ingredientId, dish: menuItems.name })
      .from(recipeLines)
      .innerJoin(menuItems, eq(recipeLines.menuItemId, menuItems.id)),
  ]);

  const dishesByIngredient = new Map<string, string[]>();
  for (const { ingredientId, dish } of uses) {
    dishesByIngredient.set(ingredientId, [...(dishesByIngredient.get(ingredientId) ?? []), dish]);
  }

  return rows
    .map((item) => ({
      ...item,
      level: stockLevel(item),
      fill: Math.min(1, item.stock / (item.reorderLevel * 3)),
      usedIn: (dishesByIngredient.get(item.id) ?? []).sort(),
      suggestedQty: suggestedOrder(item),
    }))
    .sort((a, b) => a.stock / a.reorderLevel - b.stock / b.reorderLevel || a.name.localeCompare(b.name));
}
