export interface RecipeStockLine {
  /** Amount of the ingredient one portion uses. */
  quantity: number;
  /** Amount of the ingredient currently in stock. */
  stock: number;
}

/**
 * How many portions of a dish the kitchen can still make: limited by whichever ingredient runs out
 * first. Returns null for a dish with no recipe (nothing to run out of). It looks at each dish on
 * its own, so two dishes sharing an ingredient can overlap; the order API is the final authority.
 */
export function portionsFromRecipe(lines: RecipeStockLine[]): number | null {
  if (lines.length === 0) return null;
  return Math.min(...lines.map((l) => Math.max(0, Math.floor(l.stock / l.quantity))));
}
