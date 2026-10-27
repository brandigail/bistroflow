import type { MenuItem } from "@/types";

export interface CartLine {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  /** Selected modifiers joined with ", " plus any free text; maps to OrderItem.notes. */
  notes: string;
}

export type CartAction =
  | { type: "add"; menuItem: MenuItem; lineId: string }
  | { type: "increment"; lineId: string }
  | { type: "decrement"; lineId: string }
  | { type: "setNotes"; lineId: string; notes: string }
  | { type: "clear" };

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const plain = lines.find((l) => l.menuItem.id === action.menuItem.id && l.notes === "");
      if (plain) return lines.map((l) => (l === plain ? { ...l, quantity: Math.min(l.quantity + 1, 50) } : l));
      return [...lines, { id: action.lineId, menuItem: action.menuItem, quantity: 1, notes: "" }];
    }
    case "increment":
      return lines.map((l) => (l.id === action.lineId ? { ...l, quantity: Math.min(l.quantity + 1, 50) } : l));
    case "decrement":
      return lines
        .map((l) => (l.id === action.lineId ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0);
    case "setNotes":
      return lines.map((l) => (l.id === action.lineId ? { ...l, notes: action.notes } : l));
    case "clear":
      return [];
  }
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.menuItem.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

const MODIFIERS: Record<string, string[]> = {
  Mains: ["No onion", "Extra cheese", "Well done", "Gluten free", "Allergy"],
  Starters: ["Dressing on side", "No croutons", "Allergy"],
  Sides: ["Extra crispy", "Sauce on side"],
  Desserts: ["No cream", "Extra sauce"],
  Drinks: ["No ice", "Extra ice", "Oat milk"],
};

export function modifiersFor(category: string): string[] {
  return MODIFIERS[category] ?? [];
}

export function toggleModifier(notes: string, modifier: string): string {
  const parts = notes ? notes.split(", ") : [];
  const next = parts.includes(modifier) ? parts.filter((p) => p !== modifier) : [...parts, modifier];
  return next.join(", ");
}
