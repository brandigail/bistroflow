"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { MenuItem } from "@/types";

/** Courses in the order a guest orders them; unknown categories sort last. */
const CATEGORY_ORDER = ["Starters", "Mains", "Sides", "Desserts", "Drinks"];

function sortCategories(categories: string[]): string[] {
  const rank = (c: string) => (CATEGORY_ORDER.includes(c) ? CATEGORY_ORDER.indexOf(c) : CATEGORY_ORDER.length);
  return [...categories].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/** At or below this many portions the menu warns the waiter before a guest is promised the dish. */
const LOW_PORTIONS = 5;

function StockNote({ soldOut, left }: { soldOut: boolean; left: number | null }) {
  if (soldOut) {
    return <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">Sold out</span>;
  }
  if (left === null || left > LOW_PORTIONS) return null;
  return (
    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
      {left === 0 ? "None left" : `Only ${left} left`}
    </span>
  );
}

interface MenuBrowserProps {
  menu: MenuItem[];
  /** Quantity of each menu item already in the cart, keyed by menu item id. */
  quantities: Record<string, number>;
  onAdd: (item: MenuItem) => void;
}

export function MenuBrowser({ menu, quantities, onAdd }: MenuBrowserProps) {
  const categories = sortCategories([...new Set(menu.map((m) => m.category))]);
  const [active, setActive] = useState(categories.includes("Mains") ? "Mains" : (categories[0] ?? ""));
  const items = menu.filter((m) => m.category === active);

  return (
    <section aria-label="Menu">
      <div role="tablist" aria-label="Menu categories" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.map((c) => {
          const inCart = menu.filter((m) => m.category === c).reduce((sum, m) => sum + (quantities[m.id] ?? 0), 0);
          return (
            <button
              key={c}
              role="tab"
              aria-selected={c === active}
              onClick={() => setActive(c)}
              className="chip shrink-0"
            >
              {c}
              {inCart > 0 && (
                <span className="rounded-full bg-background/25 px-1.5 text-xs tabular-nums" aria-label={`${inCart} in order`}>
                  {inCart}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => {
          const qty = quantities[item.id] ?? 0;
          // Stock left after what is already in this order; null portions means "no recipe, never runs out".
          const left = item.portionsLeft === null ? null : Math.max(0, item.portionsLeft - qty);
          const soldOut = !item.available || item.portionsLeft === 0;
          return (
            <li key={item.id}>
              <button
                onClick={() => onAdd(item)}
                disabled={soldOut || left === 0}
                className={`relative flex min-h-28 w-full flex-col justify-between rounded-2xl border-2 bg-surface p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${
                  qty > 0 ? "border-accent" : "border-line"
                }`}
              >
                <span className="pr-8 font-medium leading-snug">{item.name}</span>
                <span className="flex items-end justify-between gap-2">
                  <span className="font-display text-lg font-semibold">{formatMoney(item.price)}</span>
                  <StockNote soldOut={soldOut} left={left} />
                </span>
                {qty > 0 && (
                  <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground tabular-nums">
                    {qty}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
