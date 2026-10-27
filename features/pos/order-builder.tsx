"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import { BillPanel } from "@/features/billing/bill-panel";
import { formatMoney } from "@/lib/format";
import type { Bill, MenuItem, Table } from "@/types";
import { cartCount, cartReducer, cartTotal, quantityByItem } from "./cart";
import { CartPanel } from "./cart-panel";
import { MenuBrowser } from "./menu-browser";

export function OrderBuilder({ table, menu, bill }: { table: Table; menu: MenuItem[]; bill: Bill }) {
  const router = useRouter();
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const total = cartTotal(lines);
  const count = cartCount(lines);
  const hasBill = bill.lines.length > 0;

  async function sendToKitchen() {
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tableId: table.id,
          items: lines.map((l) => ({ menuItemId: l.menuItem.id, quantity: l.quantity, notes: l.notes })),
        }),
      });
      if (!response.ok) {
        const body: { error?: string } = await response.json().catch(() => ({}));
        setError(body.error ?? "Could not send the order. Try again.");
        return;
      }
      dispatch({ type: "clear" });
      setNotice(`Sent to the kitchen · ${count} ${count === 1 ? "item" : "items"}`);
      setTimeout(() => setNotice(null), 4000);
      router.refresh(); // re-fetch the open bill so the new order shows up
    } catch {
      setError("Network error. The order was not sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
      <header className="mb-4 flex items-center gap-3">
        <Link href="/" className="flex min-h-11 items-center rounded-xl border border-line px-3 text-sm font-medium">
          ← Tables
        </Link>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Table {table.label} <span className="font-sans text-sm font-normal text-muted">· {table.seats} seats</span>
        </h1>
      </header>

      {notice && (
        <p role="status" className="mb-4 rounded-xl bg-emerald-500/15 p-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
          ✓ {notice}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {hasBill && (
          <div className="lg:col-start-2 lg:row-start-1">
            <BillPanel tableId={table.id} bill={bill} />
          </div>
        )}
        <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <MenuBrowser
            menu={menu}
            quantities={quantityByItem(lines)}
            onAdd={(menuItem) => dispatch({ type: "add", menuItem, lineId: crypto.randomUUID() })}
          />
        </div>
        <div className={`lg:col-start-2 lg:self-start ${hasBill ? "lg:row-start-2" : "lg:sticky lg:top-6 lg:row-start-1"}`}>
          <CartPanel lines={lines} total={total} dispatch={dispatch} sending={sending} error={error} onSend={sendToKitchen} />
        </div>
      </div>

      {count > 0 && (
        <a
          href="#cart"
          className="fixed inset-x-4 bottom-4 flex min-h-12 items-center justify-between rounded-xl bg-accent px-4 font-semibold text-accent-foreground shadow-lg lg:hidden"
        >
          <span>
            {count} {count === 1 ? "item" : "items"}
          </span>
          <span>View order · {formatMoney(total)}</span>
        </a>
      )}
    </main>
  );
}
