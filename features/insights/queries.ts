import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { buildDailySeries, type DayPoint, type DayRow } from "./series";

const WINDOW_DAYS = 14;

export interface TopDish {
  name: string;
  units: number;
  revenue: number;
}

export interface HourBucket {
  hour: number;
  orders: number;
}

export interface Insights {
  daily: DayPoint[];
  topDishes: TopDish[];
  hours: HourBucket[];
}

/** Sales analytics over paid orders: the last two weeks by day, the best sellers, and the busiest hours. */
export async function getInsights(): Promise<Insights> {
  const db = getDb();
  const window = sql.raw(`interval '${WINDOW_DAYS} days'`);

  const [daily, dishes, hours] = await Promise.all([
    db.execute<{ day: string; orders: number; units: number; cents: number }>(sql`
      select to_char(date_trunc('day', o.created_at), 'YYYY-MM-DD') as day,
             count(distinct o.id)::int as orders,
             sum(oi.quantity)::int as units,
             sum(m.price_cents * oi.quantity)::int as cents
      from orders o
      join order_items oi on oi.order_id = o.id
      join menu_items m on m.id = oi.menu_item_id
      where o.status = 'PAID' and o.created_at >= now() - ${window}
      group by 1 order by 1`),
    db.execute<{ name: string; units: number; cents: number }>(sql`
      select m.name as name, sum(oi.quantity)::int as units, sum(m.price_cents * oi.quantity)::int as cents
      from orders o
      join order_items oi on oi.order_id = o.id
      join menu_items m on m.id = oi.menu_item_id
      where o.status = 'PAID' and o.created_at >= now() - interval '7 days'
      group by m.name order by units desc, m.name limit 6`),
    db.execute<{ hour: number; orders: number }>(sql`
      select extract(hour from o.created_at)::int as hour, count(*)::int as orders
      from orders o
      where o.status = 'PAID' and o.created_at >= now() - ${window}
      group by 1 order by 1`),
  ]);

  const dayRows: DayRow[] = daily.rows.map((r) => ({ day: r.day, orders: r.orders, units: r.units, cents: r.cents }));
  const byHour = new Map(hours.rows.map((r) => [r.hour, r.orders]));

  return {
    daily: buildDailySeries(dayRows, WINDOW_DAYS, new Date()),
    topDishes: dishes.rows.map((r) => ({ name: r.name, units: r.units, revenue: r.cents / 100 })),
    // Opening hours only, so the histogram is not padded with empty overnight bars.
    hours: Array.from({ length: 12 }, (_, i) => ({ hour: i + 11, orders: byHour.get(i + 11) ?? 0 })),
  };
}
