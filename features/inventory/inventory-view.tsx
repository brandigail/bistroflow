import { connection } from "next/server";
import { getInventory, type InventoryRow, type StockLevel } from "./queries";

const LEVEL_STYLES: Record<StockLevel, { label: string; pill: string; bar: string }> = {
  OUT: { label: "Out of stock", pill: "bg-red-500/15 text-red-700 dark:text-red-300", bar: "bg-red-500" },
  LOW: { label: "Reorder", pill: "bg-amber-500/15 text-amber-700 dark:text-amber-300", bar: "bg-amber-500" },
  OK: { label: "In stock", pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", bar: "bg-emerald-500" },
};

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function Quantity({ item }: { item: InventoryRow }) {
  return (
    <span className="tabular-nums">
      {number.format(item.stock)} <span className="text-muted">{item.unit}</span>
    </span>
  );
}

function AlertList({ items }: { items: InventoryRow[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-line bg-surface p-5 text-muted">
        Everything is above its reorder level. Nothing to order right now.
      </p>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const style = LEVEL_STYLES[item.level];
        return (
          <li key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
            <div className="min-w-0">
              <p className="truncate font-semibold">{item.name}</p>
              <p className="text-sm text-muted">
                <Quantity item={item} /> left · reorder at {number.format(item.reorderLevel)} {item.unit}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style.pill}`}>{style.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export async function InventoryView() {
  await connection(); // live DB data: render at request time, never at build
  const items = await getInventory();
  const alerts = items.filter((i) => i.level !== "OK");

  return (
    <>
      <section aria-labelledby="alerts-heading" className="mb-10">
        <h2 id="alerts-heading" className="font-display mb-3 flex items-center gap-3 text-2xl font-semibold">
          Reorder alerts
          <span className="rounded-full bg-accent px-2.5 py-0.5 font-sans text-sm text-accent-foreground tabular-nums">
            {alerts.length}
          </span>
        </h2>
        <AlertList items={alerts} />
      </section>

      <section aria-labelledby="stock-heading">
        <h2 id="stock-heading" className="font-display mb-3 text-2xl font-semibold">
          All ingredients
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Ingredient</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Reorder at</th>
                <th className="w-40 px-4 py-3 font-medium">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => {
                const style = LEVEL_STYLES[item.level];
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <Quantity item={item} />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted">
                      {number.format(item.reorderLevel)} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        role="img"
                        aria-label={`${style.label}: ${Math.round(item.fill * 100)}% of target`}
                        className="h-2 overflow-hidden rounded-full bg-surface-2"
                      >
                        <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${Math.max(item.fill * 100, 3)}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function InventorySkeleton() {
  return <div aria-busy="true" className="h-64 animate-pulse rounded-2xl bg-surface-2" />;
}
