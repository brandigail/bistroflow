import { describe, expect, it } from "vitest";
import { canAccessPath, canAdvanceTo, canManageInventory, canResetDemo, canTakeOrders, homeFor } from "./permissions";

describe("homeFor", () => {
  it("sends kitchen staff to the kitchen display and everyone else to the floor", () => {
    expect(homeFor("kitchen")).toBe("/kds");
    expect(homeFor("waiter")).toBe("/floor");
    expect(homeFor("manager")).toBe("/floor");
  });
});

describe("canAccessPath", () => {
  it("restricts inventory and insights to managers", () => {
    expect(canAccessPath("manager", "/inventory")).toBe(true);
    expect(canAccessPath("manager", "/insights")).toBe(true);
    expect(canAccessPath("waiter", "/insights")).toBe(false);
    expect(canAccessPath("kitchen", "/insights")).toBe(false);
    expect(canAccessPath("waiter", "/inventory")).toBe(false);
    expect(canAccessPath("kitchen", "/inventory")).toBe(false);
  });

  it("keeps kitchen staff off the floor and POS but lets everyone see the kitchen display", () => {
    expect(canAccessPath("kitchen", "/floor")).toBe(false);
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

describe("canManageInventory", () => {
  it("allows managers only", () => {
    expect(canManageInventory("manager")).toBe(true);
    expect(canManageInventory("waiter")).toBe(false);
    expect(canManageInventory("kitchen")).toBe(false);
  });
});

describe("canResetDemo", () => {
  it("allows managers only", () => {
    expect(canResetDemo("manager")).toBe(true);
    expect(canResetDemo("waiter")).toBe(false);
    expect(canResetDemo("kitchen")).toBe(false);
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
