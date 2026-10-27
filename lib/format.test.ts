import { describe, expect, it } from "vitest";
import { formatCompactMoney, formatMoney, formatWholeMoney } from "./format";

describe("money formatting", () => {
  it("formats currency with cents", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
  });

  it("formats whole dollars for headline figures", () => {
    expect(formatWholeMoney(1234.56)).toBe("$1,235");
  });

  it("shortens axis values", () => {
    expect(formatCompactMoney(950)).toBe("$950");
    expect(formatCompactMoney(2500)).toBe("$2.5k");
    expect(formatCompactMoney(0)).toBe("$0");
  });
});
