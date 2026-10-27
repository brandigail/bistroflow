"use client";

import { useState } from "react";
import { NEXT_STATUS } from "@/features/orders/transitions";
import { useLiveOrders } from "@/features/orders/use-live-orders";
import { canAdvanceTo } from "@/lib/permissions";
import type { KitchenOrder, StaffRole, TicketStatus } from "@/types";
import { TicketCard } from "./ticket-card";
import { useNow } from "./use-now";

const COLUMNS: { status: TicketStatus; title: string; accent: string }[] = [
  { status: "NEW", title: "New", accent: "border-sky-500" },
  { status: "PREPARING", title: "Preparing", accent: "border-amber-500" },
  { status: "READY", title: "Ready", accent: "border-violet-500" },
];

export function KdsBoard({ role }: { role: StaffRole }) {
  const { orders, loading, error, refresh } = useLiveOrders();
  const now = useNow();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function advance(order: KitchenOrder) {
    const target = NEXT_STATUS[order.status];
    if (!target) return;
    setBusyId(order.id);
    setActionError(null);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: target }),
      });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        setActionError(body.error ?? "Could not update the ticket.");
      }
    } catch {
      setActionError("Network error. The ticket was not updated.");
    } finally {
      setBusyId(null);
      await refresh();
    }
  }

  return (
    <div>
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Kitchen</h1>
        <span className="ml-auto flex items-center gap-2 text-sm opacity-70">
          <span
            aria-hidden
            className={`size-2.5 rounded-full ${error ? "bg-red-500" : "animate-pulse bg-emerald-500"}`}
          />
          {error ? "Connection lost, retrying…" : "Live"}
        </span>
      </header>
      {actionError && (
        <p role="alert" className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {actionError}
        </p>
      )}
      {loading ? (
        <p className="py-10 text-center opacity-60">Loading tickets…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map(({ status, title, accent }) => {
            const tickets = orders.filter((o) => o.status === status);
            return (
              <section key={status} aria-label={title} className={`rounded-2xl border-t-4 bg-surface-2 p-3 ${accent}`}>
                <h2 className="font-display mb-3 flex items-center justify-between text-lg font-semibold">
                  {title}
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-sm tabular-nums">{tickets.length}</span>
                </h2>
                {tickets.length === 0 ? (
                  <p className="py-6 text-center text-sm opacity-50">No tickets</p>
                ) : (
                  <ul className="space-y-3">
                    {tickets.map((o) => (
                      <TicketCard
                        key={o.id}
                        order={o}
                        now={now}
                        busy={busyId === o.id}
                        canAdvance={canAdvanceTo(role, NEXT_STATUS[o.status] ?? o.status)}
                        onAdvance={advance}
                      />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
