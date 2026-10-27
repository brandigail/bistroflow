import { describe, expect, it } from "vitest";
import type { MenuItem } from "@/types";
import { cartCount, cartReducer, cartTotal, modifiersFor, quantityByItem, toggleModifier, type CartLine } from "./cart";

const burger: MenuItem = { id: "m1", name: "Classic Burger", category: "Mains", price: 14.95, available: true };
const cola: MenuItem = { id: "m2", name: "Cola", category: "Drinks", price: 3.2, available: true };

const add = (lines: CartLine[], menuItem: MenuItem, lineId: string) => cartReducer(lines, { type: "add", menuItem, lineId });

describe("cartReducer", () => {
  it("adds a new line", () => {
    const lines = add([], burger, "a");
    expect(lines).toEqual([{ id: "a", menuItem: burger, quantity: 1, notes: "" }]);
  });

  it("merges repeated taps on a plain item into one line", () => {
    const lines = add(add([], burger, "a"), burger, "b");
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(2);
  });

  it("keeps a modified line separate from a plain one", () => {
    let lines = add([], burger, "a");
    lines = cartReducer(lines, { type: "setNotes", lineId: "a", notes: "No onion" });
    lines = add(lines, burger, "b");
    expect(lines.map((l) => [l.quantity, l.notes])).toEqual([[1, "No onion"], [1, ""]]);
  });

  it("removes a line when its quantity reaches zero", () => {
    const lines = cartReducer(add([], cola, "a"), { type: "decrement", lineId: "a" });
    expect(lines).toEqual([]);
  });

  it("caps quantity at 50, matching the API limit", () => {
    let lines = add([], cola, "a");
    for (let i = 0; i < 60; i++) lines = cartReducer(lines, { type: "increment", lineId: "a" });
    expect(lines[0].quantity).toBe(50);
  });

  it("clears the cart", () => {
    expect(cartReducer(add([], cola, "a"), { type: "clear" })).toEqual([]);
  });
});

describe("cart totals", () => {
  const lines = add(add(add([], burger, "a"), burger, "b"), cola, "c");

  it("counts items and sums the price", () => {
    expect(cartCount(lines)).toBe(3);
    expect(cartTotal(lines)).toBeCloseTo(33.1, 2);
  });

  it("totals quantity per dish across lines", () => {
    const withNote = cartReducer(add([], burger, "a"), { type: "setNotes", lineId: "a", notes: "Well done" });
    expect(quantityByItem(add(withNote, burger, "b"))).toEqual({ m1: 2 });
  });
});

describe("modifiers", () => {
  it("toggles a modifier on and off", () => {
    const on = toggleModifier("", "No onion");
    expect(on).toBe("No onion");
    expect(toggleModifier(on, "Extra cheese")).toBe("No onion, Extra cheese");
    expect(toggleModifier("No onion, Extra cheese", "No onion")).toBe("Extra cheese");
  });

  it("offers category-specific options and none for unknown categories", () => {
    expect(modifiersFor("Drinks")).toContain("No ice");
    expect(modifiersFor("Mystery")).toEqual([]);
  });
});
