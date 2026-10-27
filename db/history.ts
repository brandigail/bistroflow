import { HOUR_WEIGHTS, POPULARITY } from "./demo-data";

export interface HistoricOrder {
  id: string;
  tableLabel: string;
  createdAt: Date;
  items: { dish: string; quantity: number }[];
}

const DAYS = 14;

/** Small deterministic PRNG so every reseed produces the same believable history. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted<T extends string | number>(weights: Record<T, number>, random: () => number, exclude: T[] = []): T {
  const entries = (Object.entries(weights) as [T, number][]).filter(([key]) => !exclude.includes(key));
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/**
 * Two weeks of paid orders ending now: busier Fridays and Saturdays, lunch and dinner peaks, and a
 * gentle upward trend, so the Insights page has something real to show.
 */
export function generateHistory(now: Date, tableLabels: string[]): HistoricOrder[] {
  const random = mulberry32(20261027);
  const orders: HistoricOrder[] = [];
  const dishes = Object.keys(POPULARITY);

  for (let daysAgo = DAYS - 1; daysAgo >= 0; daysAgo--) {
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
    const weekday = day.getUTCDay();
    const weekend = weekday === 5 || weekday === 6;
    const trend = 1 + (DAYS - 1 - daysAgo) * 0.025;
    const count = Math.round((26 + random() * 10) * (weekend ? 1.7 : 1) * trend);

    for (let i = 0; i < count; i++) {
      const hour = Number(pickWeighted(HOUR_WEIGHTS, random));
      const createdAt = new Date(day.getTime() + hour * 3_600_000 + Math.floor(random() * 60) * 60_000);
      if (createdAt >= now) continue; // nothing in the future, and keep today's in-flight orders realistic

      const lineCount = 1 + Math.floor(random() * 4);
      const picked: string[] = [];
      const items = Array.from({ length: lineCount }, () => {
        const dish = pickWeighted(
          Object.fromEntries(dishes.map((d) => [d, POPULARITY[d]])) as Record<string, number>,
          random,
          picked,
        );
        picked.push(dish);
        const roll = random();
        return { dish, quantity: roll < 0.7 ? 1 : roll < 0.95 ? 2 : 3 };
      });

      orders.push({
        id: crypto.randomUUID(),
        tableLabel: tableLabels[Math.floor(random() * tableLabels.length)],
        createdAt,
        items,
      });
    }
  }
  return orders;
}
