"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { Bill } from "@/types";

export function BillPanel({ tableId, bill }: { tableId: string; bill: Bill }) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const itemCount = bill.lines.reduce((sum, l) => sum + l.quantity, 0);

  async function pay() {
    setPaying(true);
    setError(null);
    try {
      const response = await fetch(`/api/tables/${tableId}/pay`, { method: "POST" });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        setError(body.error ?? "Could not take payment.");
        return;
      }
      router.push("/");
    } catch {
      setError("Network error. Payment was not taken.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <section aria-label="Bill" className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Open bill</h2>
        <span className="font-display text-2xl font-bold tabular-nums">{formatMoney(bill.total)}</span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-1 flex min-h-11 items-center gap-1 text-sm text-muted underline-offset-2 hover:underline"
      >
        {expanded ? "Hide" : "Show"} {itemCount} {itemCount === 1 ? "item" : "items"}
      </button>
      {expanded && (
        <ul className="mb-2 divide-y divide-line">
          {bill.lines.map((l) => (
            <li key={l.name} className="flex items-baseline justify-between gap-3 py-2 text-sm">
              <span>
                <span className="font-semibold tabular-nums">{l.quantity}×</span> {l.name}
              </span>
              <span className="tabular-nums text-muted">{formatMoney(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      {bill.kitchenPending && (
        <p className="mb-3 rounded-lg bg-surface-2 p-3 text-sm text-muted">Payment unlocks once the kitchen has finished.</p>
      )}
      {error && (
        <p role="alert" className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <button
        onClick={pay}
        disabled={bill.kitchenPending || paying}
        className="min-h-12 w-full rounded-xl bg-accent px-4 font-semibold text-accent-foreground disabled:opacity-40"
      >
        {paying ? "Processing…" : "Take payment"}
      </button>
      <p className="mt-2 text-center text-xs text-muted">Mock payment: no card is charged.</p>
    </section>
  );
}
