import { getDb } from "@/db";
import { ingredients } from "@/db/schema";
import type { Ingredient } from "@/types";

export type StockLevel = "OUT" | "LOW" | "OK";

export interface InventoryRow extends Ingredient {
  level: StockLevel;
  /** 0..1 fill for the stock bar, where 1 = three times the reorder level. */
  fill: number;
}

export function stockLevel(item: Ingredient): StockLevel {
  if (item.stock <= 0) return "OUT";
  return item.stock <= item.reorderLevel ? "LOW" : "OK";
}

/** Every ingredient, most urgent first (lowest stock relative to its reorder level). */
export async function getInventory(): Promise<InventoryRow[]> {
  const rows = await getDb().select().from(ingredients);
  return rows
    .map((item) => ({
      ...item,
      level: stockLevel(item),
      fill: Math.min(1, item.stock / (item.reorderLevel * 3)),
    }))
    .sort((a, b) => a.stock / a.reorderLevel - b.stock / b.reorderLevel || a.name.localeCompare(b.name));
}
