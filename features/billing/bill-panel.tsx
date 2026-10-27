"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { Bill } from "@/types";

export function BillPanel({ tableId, bill }: { tableId: string; bill: Bill }) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <section aria-label="Bill" className="mb-6 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-5">
      <h2 className="font-display mb-3 text-xl font-semibold">Open bill</h2>
      <ul className="divide-y divide-line">
        {bill.lines.map((l) => (
          <li key={l.name} className="flex items-baseline justify-between gap-3 py-2">
            <span>
              <span className="font-semibold tabular-nums">{l.quantity}×</span> {l.name}
            </span>
            <span className="tabular-nums text-muted">{formatMoney(l.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="font-display text-lg font-semibold">Total</span>
        <span className="font-display text-2xl font-bold tabular-nums">{formatMoney(bill.total)}</span>
      </div>
      {bill.kitchenPending && (
        <p className="mt-3 rounded-lg bg-surface-2 p-3 text-sm text-muted">
          The kitchen is still preparing part of this order. Payment unlocks once everything is ready.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <button
        onClick={pay}
        disabled={bill.kitchenPending || paying}
        className="mt-4 min-h-12 w-full rounded-xl bg-accent px-4 font-semibold text-accent-foreground disabled:opacity-40"
      >
        {paying ? "Processing…" : `Take payment · ${formatMoney(bill.total)}`}
      </button>
      <p className="mt-2 text-center text-xs text-muted">Mock payment: no card is charged.</p>
    </section>
  );
}
