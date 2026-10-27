"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import { formatMoney } from "@/lib/format";
import type { MenuItem, Table } from "@/types";
import { cartCount, cartReducer, cartTotal } from "./cart";
import { CartPanel } from "./cart-panel";
import { MenuBrowser } from "./menu-browser";

export function OrderBuilder({ table, menu }: { table: Table; menu: MenuItem[] }) {
  const router = useRouter();
  const [lines, dispatch] = useReducer(cartReducer, []);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = cartTotal(lines);
  const count = cartCount(lines);

  async function sendToKitchen() {
    setSending(true);
    setError(null);
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
      router.push("/");
    } catch {
      setError("Network error. The order was not sent.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
      <header className="mb-4 flex items-center gap-3">
        <Link href="/" className="flex min-h-11 items-center rounded-lg border border-foreground/25 px-3 text-sm">
          ← Tables
        </Link>
        <h1 className="text-xl font-bold sm:text-2xl">
          Table {table.label} <span className="text-sm font-normal opacity-60">· {table.seats} seats</span>
        </h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <MenuBrowser menu={menu} onAdd={(menuItem) => dispatch({ type: "add", menuItem, lineId: crypto.randomUUID() })} />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <CartPanel lines={lines} total={total} dispatch={dispatch} sending={sending} error={error} onSend={sendToKitchen} />
        </div>
      </div>
      <a
        href="#cart"
        className="fixed inset-x-4 bottom-4 flex min-h-12 items-center justify-between rounded-xl bg-foreground px-4 font-semibold text-background shadow-lg lg:hidden"
      >
        <span>
          {count} {count === 1 ? "item" : "items"}
        </span>
        <span>View order · {formatMoney(total)}</span>
      </a>
    </div>
  );
}
