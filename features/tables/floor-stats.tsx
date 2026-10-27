import { connection } from "next/server";
import { requireAccess } from "@/lib/access";
import { formatMoney } from "@/lib/format";
import { getFloorStats } from "./queries";

export async function FloorStats() {
  await connection(); // live DB data: render at request time, never at build
  await requireAccess("/floor");
  const stats = await getFloorStats();

  const cards = [
    { label: "Tables in service", value: `${stats.openTables}`, hint: `of ${stats.totalTables}` },
    { label: "In the kitchen", value: `${stats.kitchenTickets}`, hint: stats.kitchenTickets === 1 ? "ticket" : "tickets" },
    { label: "Open tabs", value: formatMoney(stats.openTabs), hint: "unpaid" },
    { label: "Reorder alerts", value: `${stats.lowStock}`, hint: stats.lowStock === 1 ? "ingredient" : "ingredients" },
  ];

  return (
    <dl className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <dt className="text-sm text-muted">{c.label}</dt>
          <dd className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tabular-nums">{c.value}</span>
            <span className="text-sm text-muted">{c.hint}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function FloorStatsSkeleton() {
  return (
    <div aria-busy="true" className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-2" />
      ))}
    </div>
  );
}
