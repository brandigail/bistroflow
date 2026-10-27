import { describe, expect, it } from "vitest";
import type { Ingredient } from "@/types";
import { formatSupplierOrder, suggestedOrder } from "./reorder";

const item = (over: Partial<Ingredient>): Ingredient => ({
  id: "i1",
  name: "Cream",
  unit: "ml",
  stock: 850,
  reorderLevel: 1000,
  ...over,
});

describe("suggestedOrder", () => {
  it("tops up to three times the reorder level, rounded up to the nearest 100 for weights and volumes", () => {
    // target 3000 ml, have 850, short 2150, rounded up to 2200
    expect(suggestedOrder(item({}))).toBe(2200);
  });

  it("rounds counted items up to whole pieces", () => {
    // target 45, have 12, short 33
    expect(suggestedOrder(item({ unit: "pcs", stock: 12, reorderLevel: 15 }))).toBe(33);
    expect(suggestedOrder(item({ unit: "pcs", stock: 12.4, reorderLevel: 15 }))).toBe(33);
  });

  it("is zero for an ingredient already at or above target", () => {
    expect(suggestedOrder(item({ stock: 5000 }))).toBe(0);
  });
});

describe("formatSupplierOrder", () => {
  it("builds a dated plain-text list", () => {
    const text = formatSupplierOrder(
      [
        { name: "Cream", quantity: 2200, unit: "ml" },
        { name: "Lemons", quantity: 33, unit: "pcs" },
      ],
      new Date("2026-10-27T10:00:00Z"),
    );
    expect(text).toBe("BistroFlow stock order, 2026-10-27\n\n- Cream: 2,200 ml\n- Lemons: 33 pcs");
  });
});
