import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ingredients, menuItems, recipeLines, tables } from "@/db/schema";
import type { MenuItem, Table } from "@/types";
import { portionsFromRecipe, type RecipeStockLine } from "./portions";

export async function getMenu(): Promise<MenuItem[]> {
  const db = getDb();
  const [rows, recipe] = await Promise.all([
    db.select().from(menuItems).orderBy(menuItems.category, menuItems.name),
    db
      .select({ menuItemId: recipeLines.menuItemId, quantity: recipeLines.quantity, stock: ingredients.stock })
      .from(recipeLines)
      .innerJoin(ingredients, eq(recipeLines.ingredientId, ingredients.id)),
  ]);

  const linesByDish = new Map<string, RecipeStockLine[]>();
  for (const { menuItemId, ...line } of recipe) linesByDish.set(menuItemId, [...(linesByDish.get(menuItemId) ?? []), line]);

  return rows.map(({ priceCents, ...rest }) => ({
    ...rest,
    price: priceCents / 100,
    portionsLeft: portionsFromRecipe(linesByDish.get(rest.id) ?? []),
  }));
}

export async function getTable(id: string): Promise<Table | null> {
  const [row] = await getDb().select().from(tables).where(eq(tables.id, id)).limit(1);
  return row ?? null;
}
