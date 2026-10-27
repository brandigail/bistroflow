import { describe, expect, it } from "vitest";
import { portionsFromRecipe } from "./portions";

describe("portionsFromRecipe", () => {
  it("is limited by the ingredient that runs out first", () => {
    // 45 patties would allow 45 burgers, but only 120 g of lettuce at 30 g each allows 4.
    expect(
      portionsFromRecipe([
        { quantity: 1, stock: 45 },
        { quantity: 30, stock: 120 },
      ]),
    ).toBe(4);
  });

  it("rounds down to whole portions", () => {
    expect(portionsFromRecipe([{ quantity: 18, stock: 100 }])).toBe(5);
  });

  it("is zero when any ingredient is short of one portion or empty", () => {
    expect(portionsFromRecipe([{ quantity: 150, stock: 100 }])).toBe(0);
    expect(portionsFromRecipe([{ quantity: 1, stock: 0 }])).toBe(0);
  });

  it("is null (unlimited) for a dish with no recipe", () => {
    expect(portionsFromRecipe([])).toBeNull();
  });
});
