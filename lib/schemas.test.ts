import { describe, expect, it } from "vitest";
import { placeOrderSchema, updateStatusSchema } from "./schemas";

const TABLE = "4812fafa-8def-4fc9-b57f-8c686e84c0f9";
const DISH = "239d64c7-0673-4dec-909b-a91a3669ad08";

describe("placeOrderSchema", () => {
  it("accepts a valid order and defaults notes to empty", () => {
    const parsed = placeOrderSchema.parse({ tableId: TABLE, items: [{ menuItemId: DISH, quantity: 2 }] });
    expect(parsed.items[0].notes).toBe("");
  });

  it.each([
    ["no items", { tableId: TABLE, items: [] }],
    ["zero quantity", { tableId: TABLE, items: [{ menuItemId: DISH, quantity: 0 }] }],
    ["fractional quantity", { tableId: TABLE, items: [{ menuItemId: DISH, quantity: 1.5 }] }],
    ["quantity over the limit", { tableId: TABLE, items: [{ menuItemId: DISH, quantity: 51 }] }],
    ["bad table id", { tableId: "T1", items: [{ menuItemId: DISH, quantity: 1 }] }],
    ["overlong notes", { tableId: TABLE, items: [{ menuItemId: DISH, quantity: 1, notes: "x".repeat(201) }] }],
  ])("rejects %s", (_name, input) => {
    expect(placeOrderSchema.safeParse(input).success).toBe(false);
  });
});

describe("updateStatusSchema", () => {
  it("accepts known statuses only", () => {
    expect(updateStatusSchema.safeParse({ status: "READY" }).success).toBe(true);
    expect(updateStatusSchema.safeParse({ status: "COOKING" }).success).toBe(false);
  });
});
