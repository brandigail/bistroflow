import { connection } from "next/server";
import type { TicketStatus } from "@/types";
import { getTablesWithState } from "./queries";

const STATE_STYLES: Record<TicketStatus | "FREE", { label: string; classes: string }> = {
  FREE: { label: "Free", classes: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  NEW: { label: "Order sent", classes: "border-sky-500/60 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  PREPARING: { label: "Preparing", classes: "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  READY: { label: "Ready to serve", classes: "border-violet-500/60 bg-violet-500/10 text-violet-700 dark:text-violet-300" },
  SERVED: { label: "Served", classes: "border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300" },
  PAID: { label: "Paid", classes: "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
};

export async function TableMap() {
  await connection(); // live DB data: render at request time, never at build
  const tables = await getTablesWithState();

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {tables.map((table) => {
        const state = STATE_STYLES[table.orderStatus ?? "FREE"];
        return (
          <li
            key={table.id}
            className={`flex min-h-28 flex-col justify-between rounded-xl border-2 p-4 ${state.classes}`}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{table.label}</span>
              <span className="text-sm opacity-80">{table.seats} seats</span>
            </div>
            <span className="text-sm font-medium">{state.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function TableMapSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: 12 }, (_, i) => (
        <li key={i} className="min-h-28 animate-pulse rounded-xl bg-foreground/10" />
      ))}
    </ul>
  );
}
