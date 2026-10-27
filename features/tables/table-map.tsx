import Link from "next/link";
import { connection } from "next/server";
import { requireAccess } from "@/lib/access";
import type { TicketStatus } from "@/types";
import { getTablesWithState } from "./queries";

const STATE_STYLES: Record<TicketStatus | "FREE", { label: string; dot: string; card: string }> = {
  FREE: { label: "Free", dot: "bg-emerald-500", card: "border-line bg-surface" },
  NEW: { label: "Order sent", dot: "bg-sky-500", card: "border-sky-500/50 bg-sky-500/10" },
  PREPARING: { label: "Preparing", dot: "bg-amber-500", card: "border-amber-500/50 bg-amber-500/10" },
  READY: { label: "Ready to serve", dot: "bg-accent", card: "border-accent bg-accent/10" },
  SERVED: { label: "Awaiting bill", dot: "bg-rose-500", card: "border-rose-500/50 bg-rose-500/10" },
  PAID: { label: "Paid", dot: "bg-emerald-500", card: "border-line bg-surface" },
};

export async function TableMap() {
  await connection(); // live DB data: render at request time, never at build
  await requireAccess("/floor");
  const tables = await getTablesWithState();

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {tables.map((table) => {
        const state = STATE_STYLES[table.orderStatus ?? "FREE"];
        return (
          <li key={table.id}>
            <Link
              href={`/pos/${table.id}`}
              className={`flex min-h-32 flex-col justify-between rounded-2xl border-2 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${state.card}`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-semibold">{table.label}</span>
                <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
                  {table.seats} seats
                </span>
              </div>
              <span className="flex items-center gap-2 text-sm font-medium">
                <span aria-hidden className={`size-2.5 rounded-full ${state.dot}`} />
                {state.label}
              </span>
            </Link>
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
        <li key={i} className="min-h-32 animate-pulse rounded-2xl bg-surface-2" />
      ))}
    </ul>
  );
}
