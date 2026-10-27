import type { TicketStatus } from "@/types";

/** The only legal forward move from each status. PAID is handled by the pay flow (step 10). */
export const NEXT_STATUS: Partial<Record<TicketStatus, TicketStatus>> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: "SERVED",
};

export function previousStatus(target: TicketStatus): TicketStatus | undefined {
  return (Object.entries(NEXT_STATUS) as [TicketStatus, TicketStatus][]).find(([, next]) => next === target)?.[0];
}
