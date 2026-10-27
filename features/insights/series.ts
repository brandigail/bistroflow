export interface DayRow {
  /** ISO date, YYYY-MM-DD (UTC). */
  day: string;
  orders: number;
  units: number;
  cents: number;
}

export interface DayPoint {
  day: string;
  /** Short axis label, e.g. "Mon 20". */
  label: string;
  /** Long label for tooltips, e.g. "Monday 20 October". */
  longLabel: string;
  orders: number;
  units: number;
  revenue: number;
  /** The most recent 7 days are "current"; the 7 before them are "previous". */
  period: "current" | "previous";
}

export interface PeriodTotals {
  revenue: number;
  orders: number;
  units: number;
  averageOrder: number;
}

const weekdayShort = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const longLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** One point per day for the last `days` days ending today (UTC), filling days with no sales with zeros. */
export function buildDailySeries(rows: DayRow[], days: number, today: Date): DayPoint[] {
  const byDay = new Map(rows.map((r) => [r.day, r]));
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (days - 1));

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start + i * 86_400_000);
    const row = byDay.get(isoDay(date));
    return {
      day: isoDay(date),
      label: `${weekdayShort.format(date)} ${date.getUTCDate()}`,
      longLabel: longLabel.format(date),
      orders: row?.orders ?? 0,
      units: row?.units ?? 0,
      revenue: (row?.cents ?? 0) / 100,
      period: i >= days - 7 ? "current" : "previous",
    };
  });
}

export function totalsFor(points: DayPoint[], period: DayPoint["period"]): PeriodTotals {
  const mine = points.filter((p) => p.period === period);
  const revenue = mine.reduce((sum, p) => sum + p.revenue, 0);
  const orders = mine.reduce((sum, p) => sum + p.orders, 0);
  const units = mine.reduce((sum, p) => sum + p.units, 0);
  return { revenue, orders, units, averageOrder: orders === 0 ? 0 : revenue / orders };
}

/** Percent change from `previous` to `current`, or null when there is no baseline to compare with. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}
