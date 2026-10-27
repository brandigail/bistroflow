import type { Ingredient } from "@/types";

/** Stock is topped back up to this many times the reorder level. */
const TARGET_MULTIPLE = 3;

const COUNTED_UNITS = new Set(["pcs", "slices", "balls", "heads"]);

/**
 * A sensible quantity to order: enough to get back to the target level. Counted items round up to a
 * whole piece; weights and volumes round up to the nearest 100 so the supplier gets a clean number.
 */
export function suggestedOrder(item: Ingredient): number {
  const shortfall = Math.max(0, item.reorderLevel * TARGET_MULTIPLE - item.stock);
  return COUNTED_UNITS.has(item.unit) ? Math.ceil(shortfall) : Math.ceil(shortfall / 100) * 100;
}

export interface SupplierLine {
  name: string;
  quantity: number;
  unit: string;
}

/** Plain-text order a manager can paste into an email or messaging app. */
export function formatSupplierOrder(lines: SupplierLine[], date: Date): string {
  const number = new Intl.NumberFormat("en-US");
  const heading = `BistroFlow stock order, ${date.toISOString().slice(0, 10)}`;
  const body = lines.map((l) => `- ${l.name}: ${number.format(l.quantity)} ${l.unit}`);
  return [heading, "", ...body].join("\n");
}
