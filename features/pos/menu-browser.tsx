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
          return (
            <li key={item.id}>
              <button
                onClick={() => onAdd(item)}
                disabled={!item.available}
                className={`relative flex min-h-28 w-full flex-col justify-between rounded-2xl border-2 bg-surface p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-sm ${
                  qty > 0 ? "border-accent" : "border-line"
                }`}
              >
                <span className="pr-8 font-medium leading-snug">{item.name}</span>
                <span className="font-display text-lg font-semibold">{item.available ? formatMoney(item.price) : "Unavailable"}</span>
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
