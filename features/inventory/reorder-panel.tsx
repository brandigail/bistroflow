"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { InventoryRow } from "./queries";
import { formatSupplierOrder } from "./reorder";

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const PILL: Record<"OUT" | "LOW", { label: string; classes: string }> = {
  OUT: { label: "Out of stock", classes: "bg-red-500/15 text-red-700 dark:text-red-300" },
  LOW: { label: "Reorder", classes: "bg-amber-500/15 text-amber-800 dark:text-amber-300" },
};

interface Message {
  kind: "ok" | "error";
  text: string;
}

export function ReorderPanel({ items }: { items: InventoryRow[] }) {
  const router = useRouter();
  // What the manager typed; anything untouched falls back to the suggested quantity.
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const lines = items
    .map((item) => ({ item, quantity: Number(typed[item.id] ?? item.suggestedQty) }))
    .filter((l) => Number.isFinite(l.quantity) && l.quantity > 0);

  async function copyOrder() {
    const text = formatSupplierOrder(
      lines.map((l) => ({ name: l.item.name, quantity: l.quantity, unit: l.item.unit })),
      new Date(),
    );
    try {
      await navigator.clipboard.writeText(text);
      setMessage({ kind: "ok", text: `Supplier order copied (${lines.length} ${lines.length === 1 ? "item" : "items"}). Paste it into an email or message.` });
    } catch {
      setMessage({ kind: "error", text: "Could not copy to the clipboard. Check your browser permissions." });
    }
  }

  async function receiveDelivery() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/inventory/receive", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: lines.map((l) => ({ ingredientId: l.item.id, quantity: l.quantity })) }),
      });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        setMessage({ kind: "error", text: body.error ?? "Could not record the delivery." });
        return;
      }
      setTyped({});
      setMessage({ kind: "ok", text: `Delivery recorded: ${lines.length} ${lines.length === 1 ? "item" : "items"} added to stock.` });
      router.refresh(); // reload stock levels so cleared alerts drop out of the list
    } catch {
      setMessage({ kind: "error", text: "Network error. The delivery was not recorded." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`mb-4 rounded-xl p-3 text-sm font-medium ${
            message.kind === "error"
              ? "bg-red-500/10 text-red-700 dark:text-red-300"
              : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"
          }`}
        >
          {message.kind === "ok" ? "✓ " : ""}
          {message.text}
        </p>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface p-5 text-muted">
          Everything is above its reorder level. Nothing to order right now.
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => {
              const pill = PILL[item.level === "OUT" ? "OUT" : "LOW"];
              return (
                <li key={item.id} className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <div className="min-w-0 flex-1 basis-56">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold">{item.name}</p>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${pill.classes}`}>{pill.label}</span>
                      </div>
                      <p className="text-sm text-muted">
                        {number.format(item.stock)} {item.unit} left · reorder at {number.format(item.reorderLevel)}
                      </p>
                      {item.usedIn.length > 0 && (
                        <p className="mt-1 text-sm text-muted">
                          <span className="font-medium text-foreground">Affects:</span> {item.usedIn.join(", ")}
                        </p>
                      )}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted">
                      <span className="sr-only">Quantity of {item.name} to order</span>
                      <span aria-hidden>Order</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        value={typed[item.id] ?? String(item.suggestedQty)}
                        onChange={(e) => setTyped({ ...typed, [item.id]: e.target.value })}
                        className="min-h-11 w-28 rounded-xl border border-line bg-background px-3 text-right text-base tabular-nums text-foreground"
                      />
                      <span className="w-8">{item.unit}</span>
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface-2 p-4">
            <p className="min-w-0 flex-1 basis-48 text-sm text-muted">
              Suggested quantities top each ingredient back up to three times its reorder level. Edit any of them, copy the order
              for your supplier, then record the delivery when it arrives.
            </p>
            <button type="button" onClick={copyOrder} disabled={lines.length === 0 || busy} className="btn btn-outline">
              Copy supplier order
            </button>
            <button type="button" onClick={receiveDelivery} disabled={lines.length === 0 || busy} className="btn btn-primary">
              {busy ? "Recording…" : "Receive delivery"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
