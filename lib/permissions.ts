import type { StaffRole, TicketStatus } from "@/types";

/** Where each role lands after signing in. */
export function homeFor(role: StaffRole): string {
  return role === "kitchen" ? "/kds" : "/floor";
}

/** Page-level access for signed-in staff. API handlers enforce their own rules below. */
export function canAccessPath(role: StaffRole, pathname: string): boolean {
  if (pathname === "/inventory" || pathname === "/insights") return role === "manager";
  if (pathname === "/kds") return true; // waiters watch the pass and mark tickets served
  return role !== "kitchen"; // floor and POS
}

export function canManageInventory(role: StaffRole): boolean {
  return role === "manager";
}

/** Wiping the demo back to its starting state: a manager-only convenience for the public demo. */
export function canResetDemo(role: StaffRole): boolean {
  return role === "manager";
}

export function canTakeOrders(role: StaffRole): boolean {
  return role === "waiter" || role === "manager";
}

/** Kitchen cooks (NEW to PREPARING to READY); waiters serve (READY to SERVED); managers can do both. */
export function canAdvanceTo(role: StaffRole, target: TicketStatus): boolean {
  if (role === "manager") return true;
  if (role === "kitchen") return target === "PREPARING" || target === "READY";
  return target === "SERVED";
}
