"use client";

import Link from "next/link";
import { useState } from "react";
import { NEXT_STATUS } from "@/features/orders/transitions";
import { useLiveOrders } from "@/features/orders/use-live-orders";
import type { KitchenOrder, TicketStatus } from "@/types";
import { TicketCard } from "./ticket-card";
import { useNow } from "./use-now";

const COLUMNS: { status: TicketStatus; title: string; accent: string }[] = [
  { status: "NEW", title: "New", accent: "border-sky-500" },
  { status: "PREPARING", title: "Preparing", accent: "border-amber-500" },
  { status: "READY", title: "Ready", accent: "border-violet-500" },
];

export function KdsBoard() {
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
    <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/" className="flex min-h-11 items-center rounded-lg border border-foreground/25 px-3 text-sm">
          ← Floor
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">Kitchen</h1>
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
              <section key={status} aria-label={title} className={`rounded-xl border-t-4 bg-foreground/5 p-3 ${accent}`}>
                <h2 className="mb-3 flex items-center justify-between font-bold">
                  {title}
                  <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-sm tabular-nums">{tickets.length}</span>
                </h2>
                {tickets.length === 0 ? (
                  <p className="py-6 text-center text-sm opacity-50">No tickets</p>
                ) : (
                  <ul className="space-y-3">
                    {tickets.map((o) => (
                      <TicketCard key={o.id} order={o} now={now} busy={busyId === o.id} onAdvance={advance} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
