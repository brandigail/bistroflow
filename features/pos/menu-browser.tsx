"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { MenuItem } from "@/types";

interface MenuBrowserProps {
  menu: MenuItem[];
  onAdd: (item: MenuItem) => void;
}

export function MenuBrowser({ menu, onAdd }: MenuBrowserProps) {
  const categories = [...new Set(menu.map((m) => m.category))];
  const [active, setActive] = useState(categories[0] ?? "");
  const items = menu.filter((m) => m.category === active);

  return (
    <section aria-label="Menu">
      <div role="tablist" className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={c === active}
            onClick={() => setActive(c)}
            className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-medium ${
              c === active ? "border-foreground bg-foreground text-background" : "border-foreground/25"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onAdd(item)}
              disabled={!item.available}
              className="flex min-h-24 w-full flex-col justify-between rounded-xl border border-foreground/20 p-3 text-left hover:bg-foreground/5 active:bg-foreground/10 disabled:opacity-40"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm opacity-70">{item.available ? formatMoney(item.price) : "Unavailable"}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
