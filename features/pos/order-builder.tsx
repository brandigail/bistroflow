"use client";

import Link from "next/link";
import { useReducer } from "react";
import { formatMoney } from "@/lib/format";
import type { MenuItem, Table } from "@/types";
import { cartCount, cartReducer, cartTotal } from "./cart";
import { CartPanel } from "./cart-panel";
import { MenuBrowser } from "./menu-browser";

export function OrderBuilder({ table, menu }: { table: Table; menu: MenuItem[] }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const total = cartTotal(lines);
  const count = cartCount(lines);

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
          <CartPanel lines={lines} total={total} dispatch={dispatch} />
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
