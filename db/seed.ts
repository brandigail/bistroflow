import bcrypt from "bcryptjs";
import { notInArray, sql } from "drizzle-orm";
import { DEMO_STAFF } from "@/features/auth/demo-staff";
import { getDb } from "./index";
import { IN_FLIGHT, MENU, STOCK, TABLES } from "./demo-data";
import { generateHistory } from "./history";
import { ingredients, menuItems, orderItems, orders, recipeLines, staff, tables } from "./schema";

// Neon is reached over the network, so every statement costs a round trip. This module keeps the
// statement count small (bulk inserts, one truncate) so the reset button stays well inside a
// serverless function's time limit. Postgres allows 65,535 parameters per statement.
const INSERT_CHUNK = 2000;

function chunks<T>(rows: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += INSERT_CHUNK) out.push(rows.slice(i, i + INSERT_CHUNK));
  return out;
}

export interface SeedSummary {
  ingredients: number;
  menuItems: number;
  tables: number;
  openOrders: number;
  historicOrders: number;
}

/** Wipes and reloads all demo data in one transaction. Used by `npm run db:seed` and the manager's reset button. */
export async function seedDemoData(): Promise<SeedSummary> {
  const now = new Date();
  const staffRows = await Promise.all(
    DEMO_STAFF.map(async (s) => ({ id: s.id, name: s.name, role: s.role, pinHash: await bcrypt.hash(s.pin, 10) })),
  );

  return getDb().transaction(async (tx) => {
    await tx.execute(sql`truncate table order_items, orders, recipe_lines, menu_items, ingredients, tables cascade`);

    // Staff keep their ids across resets so open sessions and login pages stay valid.
    await tx.delete(staff).where(notInArray(staff.id, DEMO_STAFF.map((s) => s.id)));
    await tx
      .insert(staff)
      .values(staffRows)
      .onConflictDoUpdate({
        target: staff.id,
        set: { name: sql`excluded.name`, role: sql`excluded.role`, pinHash: sql`excluded.pin_hash` },
      });

    const ing = await tx
      .insert(ingredients)
      .values(STOCK.map(([name, unit, stock, reorderLevel]) => ({ name, unit, stock, reorderLevel })))
      .returning();
    const ingId = new Map(ing.map((i) => [i.name, i.id]));

    const menu = await tx
      .insert(menuItems)
      .values(MENU.map(([name, category, priceCents]) => ({ name, category, priceCents })))
      .returning();
    const menuId = new Map(menu.map((m) => [m.name, m.id]));

    await tx.insert(recipeLines).values(
      MENU.flatMap(([name, , , recipe]) =>
        recipe.map(([ingredient, quantity]) => ({
          menuItemId: menuId.get(name)!,
          ingredientId: ingId.get(ingredient)!,
          quantity,
        })),
      ),
    );

    const tbl = await tx
      .insert(tables)
      .values(TABLES.map(([label, seats, x, y]) => ({ label, seats, x, y })))
      .returning();
    const tableId = new Map(tbl.map((t) => [t.label, t.id]));

    // In-flight orders (so the kitchen board and floor look alive) and two weeks of paid history
    // (for the Insights page) go in together. Stock is not touched: it describes the present.
    const inFlight = IN_FLIGHT.map(([table, status, minsAgo, items]) => ({
      id: crypto.randomUUID(),
      tableId: tableId.get(table)!,
      status,
      createdAt: new Date(now.getTime() - minsAgo * 60_000),
      items: items.map(([dish, quantity, notes]) => ({ dish, quantity, notes })),
    }));
    const history = generateHistory(now, TABLES.map(([label]) => label)).map((o) => ({
      id: o.id,
      tableId: tableId.get(o.tableLabel)!,
      status: "PAID" as const,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({ dish: i.dish, quantity: i.quantity, notes: "" })),
    }));

    const allOrders = [...inFlight, ...history];
    for (const batch of chunks(allOrders)) {
      await tx.insert(orders).values(batch.map(({ id, tableId, status, createdAt }) => ({ id, tableId, status, createdAt })));
    }
    const allItems = allOrders.flatMap((o) =>
      o.items.map((i) => ({ orderId: o.id, menuItemId: menuId.get(i.dish)!, quantity: i.quantity, notes: i.notes })),
    );
    for (const batch of chunks(allItems)) await tx.insert(orderItems).values(batch);

    return {
      ingredients: STOCK.length,
      menuItems: MENU.length,
      tables: TABLES.length,
      openOrders: inFlight.length,
      historicOrders: history.length,
    };
  });
}
