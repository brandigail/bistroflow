import { describe, expect, it } from "vitest";
import { canAccessPath, canAdvanceTo, canTakeOrders, homeFor } from "./permissions";

describe("homeFor", () => {
  it("sends kitchen staff to the kitchen display and everyone else to the floor", () => {
    expect(homeFor("kitchen")).toBe("/kds");
    expect(homeFor("waiter")).toBe("/");
    expect(homeFor("manager")).toBe("/");
  });
});

describe("canAccessPath", () => {
  it("restricts inventory to managers", () => {
    expect(canAccessPath("manager", "/inventory")).toBe(true);
    expect(canAccessPath("waiter", "/inventory")).toBe(false);
    expect(canAccessPath("kitchen", "/inventory")).toBe(false);
  });

  it("keeps kitchen staff off the floor and POS but lets everyone see the kitchen display", () => {
    expect(canAccessPath("kitchen", "/")).toBe(false);
    expect(canAccessPath("kitchen", "/pos/abc")).toBe(false);
    expect(canAccessPath("waiter", "/pos/abc")).toBe(true);
    for (const role of ["waiter", "kitchen", "manager"] as const) {
      expect(canAccessPath(role, "/kds")).toBe(true);
    }
  });
});

describe("canTakeOrders", () => {
  it("allows waiters and managers only", () => {
    expect(canTakeOrders("waiter")).toBe(true);
    expect(canTakeOrders("manager")).toBe(true);
    expect(canTakeOrders("kitchen")).toBe(false);
  });
});

describe("canAdvanceTo", () => {
  it("lets the kitchen cook but not serve", () => {
    expect(canAdvanceTo("kitchen", "PREPARING")).toBe(true);
    expect(canAdvanceTo("kitchen", "READY")).toBe(true);
    expect(canAdvanceTo("kitchen", "SERVED")).toBe(false);
  });

  it("lets waiters serve but not cook", () => {
    expect(canAdvanceTo("waiter", "SERVED")).toBe(true);
    expect(canAdvanceTo("waiter", "PREPARING")).toBe(false);
    expect(canAdvanceTo("waiter", "READY")).toBe(false);
  });

  it("lets managers do everything", () => {
    for (const status of ["PREPARING", "READY", "SERVED"] as const) {
      expect(canAdvanceTo("manager", status)).toBe(true);
    }
  });
});
