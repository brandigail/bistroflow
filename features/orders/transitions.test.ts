import { describe, expect, it } from "vitest";
import { NEXT_STATUS, previousStatus } from "./transitions";

describe("ticket lifecycle", () => {
  it("moves strictly forward: NEW, PREPARING, READY, SERVED", () => {
    expect(NEXT_STATUS.NEW).toBe("PREPARING");
    expect(NEXT_STATUS.PREPARING).toBe("READY");
    expect(NEXT_STATUS.READY).toBe("SERVED");
  });

  it("has no kitchen transition out of SERVED or PAID (payment is its own flow)", () => {
    expect(NEXT_STATUS.SERVED).toBeUndefined();
    expect(NEXT_STATUS.PAID).toBeUndefined();
  });

  it("finds the only status that may precede a target, so updates can be compare-and-set", () => {
    expect(previousStatus("PREPARING")).toBe("NEW");
    expect(previousStatus("READY")).toBe("PREPARING");
    expect(previousStatus("SERVED")).toBe("READY");
  });

  it("rejects targets nothing can move into", () => {
    expect(previousStatus("NEW")).toBeUndefined();
    expect(previousStatus("PAID")).toBeUndefined();
  });
});
