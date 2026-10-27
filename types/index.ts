export interface Table {
  id: string;
  label: string;
  seats: number;
  x: number;
  y: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  /** Price in whole currency units (the DB stores cents). */
  price: number;
  available: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  reorderLevel: number;
}

export interface RecipeLine {
  menuItemId: string;
  ingredientId: string;
  quantity: number;
}

export type TicketStatus = "NEW" | "PREPARING" | "READY" | "SERVED" | "PAID";

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  tableId: string;
  status: TicketStatus;
  createdAt: string;
  items: OrderItem[];
}

/** An order as the kitchen display sees it: names resolved, no ids to join. */
export interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes: string;
}

export interface KitchenOrder {
  id: string;
  tableLabel: string;
  status: TicketStatus;
  createdAt: string;
  items: KitchenOrderItem[];
}

export interface BillLine {
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** Everything unpaid on one table. */
export interface Bill {
  lines: BillLine[];
  total: number;
  /** True while any of the table's orders is still NEW or PREPARING. */
  kitchenPending: boolean;
}
