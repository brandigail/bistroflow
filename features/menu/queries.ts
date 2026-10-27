import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { menuItems, tables } from "@/db/schema";
import type { MenuItem, Table } from "@/types";

export async function getMenu(): Promise<MenuItem[]> {
  const rows = await getDb().select().from(menuItems).orderBy(menuItems.category, menuItems.name);
  return rows.map(({ priceCents, ...rest }) => ({ ...rest, price: priceCents / 100 }));
}

export async function getTable(id: string): Promise<Table | null> {
  const [row] = await getDb().select().from(tables).where(eq(tables.id, id)).limit(1);
  return row ?? null;
}
