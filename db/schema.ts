import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const ticketStatus = pgEnum("ticket_status", ["NEW", "PREPARING", "READY", "SERVED", "PAID"]);

export const tables = pgTable("tables", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().unique(),
  seats: integer("seats").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  // Stored in cents to avoid float rounding; the API layer converts to the `price` number in types/.
  priceCents: integer("price_cents").notNull(),
  available: boolean("available").notNull().default(true),
});

export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    unit: text("unit").notNull(),
    stock: doublePrecision("stock").notNull(),
    reorderLevel: doublePrecision("reorder_level").notNull(),
  },
  // Backstop for the transactional decrement: stock can never silently go negative.
  (t) => [check("ingredients_stock_non_negative", sql`${t.stock} >= 0`)],
);

export const recipeLines = pgTable(
  "recipe_lines",
  {
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "restrict" }),
    quantity: doublePrecision("quantity").notNull(),
  },
  (t) => [primaryKey({ columns: [t.menuItemId, t.ingredientId] })],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tableId: uuid("table_id")
      .notNull()
      .references(() => tables.id),
    status: ticketStatus("status").notNull().default("NEW"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_status_idx").on(t.status), index("orders_table_idx").on(t.tableId)],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    menuItemId: uuid("menu_item_id")
      .notNull()
      .references(() => menuItems.id),
    quantity: integer("quantity").notNull(),
    notes: text("notes").notNull().default(""),
  },
  (t) => [
    check("order_items_quantity_positive", sql`${t.quantity} > 0`),
    index("order_items_order_idx").on(t.orderId),
  ],
);
