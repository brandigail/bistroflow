import { describe, expect, it } from "vitest";
import { buildDailySeries, percentChange, totalsFor, type DayRow } from "./series";

const TODAY = new Date("2026-10-27T15:30:00Z"); // a Tuesday

describe("buildDailySeries", () => {
  const rows: DayRow[] = [
    { day: "2026-10-27", orders: 10, units: 25, cents: 31_250 },
    { day: "2026-10-20", orders: 8, units: 18, cents: 20_000 },
  ];
  const points = buildDailySeries(rows, 14, TODAY);

  it("returns one point per day, oldest first, ending today", () => {
    expect(points).toHaveLength(14);
    expect(points[0].day).toBe("2026-10-14");
    expect(points[13].day).toBe("2026-10-27");
  });

  it("fills days without sales with zeros and converts cents to dollars", () => {
    expect(points[12].revenue).toBe(0);
    expect(points[13]).toMatchObject({ orders: 10, units: 25, revenue: 312.5 });
  });

  it("labels days for the axis and tooltip", () => {
    expect(points[13].label).toBe("Tue 27");
    expect(points[13].longLabel).toBe("Tuesday, October 27");
  });

  it("splits the window into the previous 7 days and the latest 7 days", () => {
    expect(points.filter((p) => p.period === "previous")).toHaveLength(7);
    expect(points[6].period).toBe("previous");
    expect(points[7].period).toBe("current");
  });
});

describe("totalsFor", () => {
  it("sums a period and derives the average order value", () => {
    const points = buildDailySeries(
      [
        { day: "2026-10-27", orders: 10, units: 25, cents: 30_000 },
        { day: "2026-10-26", orders: 5, units: 10, cents: 15_000 },
      ],
      14,
      TODAY,
    );
    expect(totalsFor(points, "current")).toEqual({ revenue: 450, orders: 15, units: 35, averageOrder: 30 });
  });

  it("has a zero average order when nothing was sold", () => {
    expect(totalsFor(buildDailySeries([], 14, TODAY), "current").averageOrder).toBe(0);
  });
});

describe("percentChange", () => {
  it("computes growth and decline", () => {
    expect(percentChange(120, 100)).toBeCloseTo(20);
    expect(percentChange(75, 100)).toBeCloseTo(-25);
  });

  it("is null without a baseline", () => {
    expect(percentChange(50, 0)).toBeNull();
  });
});
