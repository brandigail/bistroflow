import { NEXT_STATUS } from "@/features/orders/transitions";
import type { KitchenOrder, TicketStatus } from "@/types";

const ACTION_LABEL: Partial<Record<TicketStatus, string>> = {
  NEW: "Start preparing",
  PREPARING: "Mark ready",
  READY: "Mark served",
};

function ageStyle(minutes: number): string {
  if (minutes >= 15) return "text-red-600 dark:text-red-400";
  if (minutes >= 10) return "text-amber-600 dark:text-amber-400";
  return "opacity-70";
}

interface TicketCardProps {
  order: KitchenOrder;
  now: number;
  busy: boolean;
  onAdvance: (order: KitchenOrder) => void;
}

export function TicketCard({ order, now, busy, onAdvance }: TicketCardProps) {
  const minutes = Math.max(0, Math.floor((now - new Date(order.createdAt).getTime()) / 60_000));
  const next = NEXT_STATUS[order.status];

  return (
    <li className="rounded-xl border border-foreground/20 bg-background p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold">{order.tableLabel}</span>
        <span className={`text-sm font-medium tabular-nums ${ageStyle(minutes)}`}>{minutes} min</span>
      </div>
      <ul className="mb-3 space-y-1">
        {order.items.map((item) => (
          <li key={item.id}>
            <span className="font-semibold tabular-nums">{item.quantity}×</span> {item.name}
            {item.notes && <p className="text-sm text-amber-700 dark:text-amber-300">{item.notes}</p>}
          </li>
        ))}
      </ul>
      {next && (
        <button
          onClick={() => onAdvance(order)}
          disabled={busy}
          className="min-h-12 w-full rounded-lg bg-foreground px-4 font-semibold text-background disabled:opacity-50"
        >
          {ACTION_LABEL[order.status]}
        </button>
      )}
    </li>
  );
}
