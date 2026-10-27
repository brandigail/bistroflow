"use client";

import { useState, type Dispatch } from "react";
import { formatMoney } from "@/lib/format";
import { modifiersFor, toggleModifier, type CartAction, type CartLine } from "./cart";

const ICON_BTN = "flex size-11 items-center justify-center rounded-lg border border-line text-lg";

function CartLineRow({ line, dispatch }: { line: CartLine; dispatch: Dispatch<CartAction> }) {
  const [open, setOpen] = useState(false);
  const modifiers = modifiersFor(line.menuItem.category);

  return (
    <li className="border-b border-line py-3 last:border-0">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{line.menuItem.name}</p>
          <p className="text-sm opacity-70">{formatMoney(line.menuItem.price * line.quantity)}</p>
        </div>
        <button
          aria-label={`Remove one ${line.menuItem.name}`}
          className={ICON_BTN}
          onClick={() => dispatch({ type: "decrement", lineId: line.id })}
        >
          −
        </button>
        <span className="w-6 text-center tabular-nums">{line.quantity}</span>
        <button
          aria-label={`Add one ${line.menuItem.name}`}
          className={ICON_BTN}
          onClick={() => dispatch({ type: "increment", lineId: line.id })}
        >
          +
        </button>
      </div>
      {line.notes && !open && <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{line.notes}</p>}
      <button className="mt-1 min-h-11 text-sm underline" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Done" : "Modifiers / notes"}
      </button>
      {open && (
        <div className="space-y-2 pb-1">
          <div className="flex flex-wrap gap-2">
            {modifiers.map((m) => {
              const on = line.notes.split(", ").includes(m);
              return (
                <button
                  key={m}
                  aria-pressed={on}
                  onClick={() => dispatch({ type: "setNotes", lineId: line.id, notes: toggleModifier(line.notes, m) })}
                  className={`min-h-11 rounded-full border px-3 text-sm ${
                    on ? "border-accent bg-accent text-accent-foreground" : "border-line"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <input
            aria-label={`Notes for ${line.menuItem.name}`}
            value={line.notes}
            maxLength={200}
            placeholder="Custom note"
            onChange={(e) => dispatch({ type: "setNotes", lineId: line.id, notes: e.target.value })}
            className="min-h-11 w-full rounded-lg border border-line bg-transparent px-3"
          />
        </div>
      )}
    </li>
  );
}

interface CartPanelProps {
  lines: CartLine[];
  total: number;
  dispatch: Dispatch<CartAction>;
  sending: boolean;
  error: string | null;
  onSend: () => void;
}

export function CartPanel({ lines, total, dispatch, sending, error, onSend }: CartPanelProps) {
  return (
    <section id="cart" aria-label="Current order" className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
      <h2 className="font-display mb-2 text-xl font-semibold">Current order</h2>
      {lines.length === 0 ? (
        <p className="py-6 text-center text-sm opacity-60">Tap menu items to start the order.</p>
      ) : (
        <ul>
          {lines.map((l) => (
            <CartLineRow key={l.id} line={l} dispatch={dispatch} />
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{formatMoney(total)}</span>
      </div>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => dispatch({ type: "clear" })}
          disabled={lines.length === 0 || sending}
          className="min-h-12 rounded-lg border border-line px-4 disabled:opacity-40"
        >
          Clear
        </button>
        <button
          onClick={onSend}
          disabled={lines.length === 0 || sending}
          className="min-h-12 flex-1 rounded-xl bg-accent px-4 font-semibold text-accent-foreground disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send to kitchen"}
        </button>
      </div>
    </section>
  );
}
