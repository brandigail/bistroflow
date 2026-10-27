import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { connection } from "next/server";
import { requireAccess } from "@/lib/access";
import { formatMoney, formatWholeMoney } from "@/lib/format";
import { BarChart, type Bar } from "./bar-chart";
import { getInsights } from "./queries";
import { ResetDemoButton } from "./reset-demo-button";
import { percentChange, totalsFor } from "./series";

const number = new Intl.NumberFormat("en-US");

function Delta({ change }: { change: number | null }) {
  if (change === null) return <span className="text-sm text-muted">no earlier data</span>;
  const flat = Math.abs(change) < 0.5;
  const up = change > 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const tone = flat ? "bg-surface-2 text-muted" : up ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300" : "bg-red-500/15 text-red-800 dark:text-red-300";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${tone}`}>
      <Icon aria-hidden className="size-3.5" />
      {flat ? "Flat" : `${up ? "+" : "−"}${Math.abs(change).toFixed(0)}%`}
      <span className="sr-only"> compared with the previous 7 days</span>
    </span>
  );
}

function Kpi({ label, value, change }: { label: string; value: string; change: number | null }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
        <Delta change={change} />
      </dd>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {subtitle && <p className="mb-4 text-sm text-muted">{subtitle}</p>}
      {children}
    </section>
  );
}

function Legend() {
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
      <li className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-sm bg-accent" /> Last 7 days
      </li>
      <li className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-sm bg-accent opacity-35" /> Previous 7 days
      </li>
    </ul>
  );
}

export async function InsightsView() {
  await connection(); // live DB data: render at request time, never at build
  await requireAccess("/insights");
  const { daily, topDishes, hours } = await getInsights();

  const current = totalsFor(daily, "current");
  const previous = totalsFor(daily, "previous");

  const revenueBars: Bar[] = daily.map((d) => ({
    id: d.day,
    axis: d.label,
    value: d.revenue,
    title: d.longLabel,
    detail: `${formatMoney(d.revenue)} from ${d.orders} ${d.orders === 1 ? "order" : "orders"}`,
    faded: d.period === "previous",
  }));

  const peakHour = hours.reduce((best, h) => (h.orders > best.orders ? h : best), hours[0]);
  const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12}${h < 12 ? "am" : "pm"}`;
  const hourBars: Bar[] = hours.map((h) => ({
    id: String(h.hour),
    axis: hourLabel(h.hour).replace(/(am|pm)/, ""),
    value: h.orders,
    title: hourLabel(h.hour),
    detail: `${h.orders} ${h.orders === 1 ? "order" : "orders"} over 14 days`,
  }));

  const topUnits = Math.max(...topDishes.map((d) => d.units), 1);

  return (
    <>
      <dl className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Revenue, 7 days" value={formatWholeMoney(current.revenue)} change={percentChange(current.revenue, previous.revenue)} />
        <Kpi label="Orders" value={number.format(current.orders)} change={percentChange(current.orders, previous.orders)} />
        <Kpi label="Average order" value={formatMoney(current.averageOrder)} change={percentChange(current.averageOrder, previous.averageOrder)} />
        <Kpi label="Items sold" value={number.format(current.units)} change={percentChange(current.units, previous.units)} />
      </dl>

      <div className="grid gap-6">
        <Card title="Revenue by day" subtitle="Paid orders over the last 14 days, compared week on week.">
          <Legend />
          <BarChart
            bars={revenueBars}
            ariaLabel="Revenue by day for the last 14 days"
            axisFormat="money"
            thinLabelsOnPhone
            valueHeading="Revenue"
          />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Best sellers" subtitle="Most-ordered dishes in the last 7 days.">
            <ol className="space-y-3">
              {topDishes.map((dish, i) => (
                <li key={dish.name}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">
                      <span className="mr-2 inline-block w-4 text-muted tabular-nums">{i + 1}</span>
                      {dish.name}
                    </span>
                    <span className="tabular-nums text-muted">
                      {number.format(dish.units)} sold · {formatWholeMoney(dish.revenue)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${(dish.units / topUnits) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card
            title="Busiest hours"
            subtitle={peakHour.orders > 0 ? `Peak is ${hourLabel(peakHour.hour)}. Orders by hour of day, last 14 days.` : "Orders by hour of day."}
          >
            <BarChart bars={hourBars} ariaLabel="Orders by hour of day" axisFormat="count" valueHeading="Orders" />
          </Card>
        </div>

        <Card title="Demo controls">
          <p className="mb-3 text-sm text-muted">
            This is a public demo, so visitors can use up stock and pile up orders. Reset restores the starting data, including two weeks of sales history.
          </p>
          <ResetDemoButton />
        </Card>
      </div>
    </>
  );
}

export function InsightsSkeleton() {
  return (
    <div aria-busy="true" className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-surface-2" />
    </div>
  );
}
