// Static demo content: the menu, recipes, stock levels and floor plan.

type Stock = [name: string, unit: string, stock: number, reorder: number];
type Dish = [name: string, category: string, priceCents: number, recipe: [ingredient: string, qty: number][]];

export const STOCK: Stock[] = [
  ["Burger bun", "pcs", 60, 20], ["Beef patty", "pcs", 45, 20], ["Cheddar", "slices", 80, 30],
  ["Lettuce", "g", 2000, 600], ["Tomato", "g", 3000, 800], ["Potatoes", "g", 9000, 3000],
  ["Chicken breast", "pcs", 30, 12], ["Pizza dough", "balls", 24, 10], ["Mozzarella", "g", 4000, 1200],
  ["Tomato sauce", "ml", 5000, 1500], ["Spaghetti", "g", 6000, 2000], ["Parmesan", "g", 1500, 500],
  // Romaine (out), Cream and Lemons are seeded low so the sold-out badges and reorder list have data.
  ["Romaine", "heads", 0, 8], ["Caesar dressing", "ml", 1500, 500], ["Chocolate", "g", 2500, 800],
  ["Cream", "ml", 550, 1000], ["Coffee beans", "g", 3000, 1000], ["Milk", "ml", 12000, 4000],
  ["Cola syrup", "ml", 8000, 2500], ["Lemons", "pcs", 9, 15],
];

export const MENU: Dish[] = [
  ["Classic Burger", "Mains", 1495, [["Burger bun", 1], ["Beef patty", 1], ["Cheddar", 1], ["Lettuce", 30], ["Tomato", 40]]],
  ["Crispy Chicken Burger", "Mains", 1395, [["Burger bun", 1], ["Chicken breast", 1], ["Lettuce", 30]]],
  ["Margherita Pizza", "Mains", 1350, [["Pizza dough", 1], ["Mozzarella", 150], ["Tomato sauce", 80]]],
  ["Spaghetti Pomodoro", "Mains", 1250, [["Spaghetti", 180], ["Tomato sauce", 150], ["Parmesan", 20]]],
  ["Grilled Chicken", "Mains", 1695, [["Chicken breast", 1], ["Potatoes", 200]]],
  ["Caesar Salad", "Starters", 995, [["Romaine", 1], ["Caesar dressing", 50], ["Parmesan", 20]]],
  ["Tomato Soup", "Starters", 795, [["Tomato", 250], ["Cream", 40]]],
  ["Fries", "Sides", 495, [["Potatoes", 250]]],
  ["Side Salad", "Sides", 450, [["Lettuce", 60], ["Tomato", 60]]],
  ["Chocolate Mousse", "Desserts", 750, [["Chocolate", 80], ["Cream", 100]]],
  ["Cappuccino", "Drinks", 380, [["Coffee beans", 18], ["Milk", 150]]],
  ["Cola", "Drinks", 320, [["Cola syrup", 60]]],
  ["Fresh Lemonade", "Drinks", 390, [["Lemons", 2]]],
];

export const TABLES: [label: string, seats: number, x: number, y: number][] = [
  ["T1", 2, 0, 0], ["T2", 2, 1, 0], ["T3", 4, 2, 0], ["T4", 4, 3, 0],
  ["T5", 4, 0, 1], ["T6", 6, 1, 1], ["T7", 4, 2, 1], ["T8", 2, 3, 1],
  ["T9", 8, 0, 2], ["T10", 6, 1, 2], ["T11", 4, 2, 2], ["T12", 2, 3, 2],
];

/** A few in-flight orders so the kitchen board and floor look alive on first load. */
export const IN_FLIGHT: [table: string, status: "NEW" | "PREPARING" | "READY" | "SERVED", minsAgo: number, items: [string, number, string][]][] = [
  ["T3", "NEW", 1, [["Classic Burger", 2, "no onion"], ["Fries", 1, ""], ["Cola", 2, ""]]],
  ["T6", "PREPARING", 6, [["Margherita Pizza", 1, ""], ["Caesar Salad", 2, "dressing on side"]]],
  ["T9", "PREPARING", 9, [["Grilled Chicken", 3, ""], ["Side Salad", 3, ""]]],
  ["T5", "READY", 14, [["Spaghetti Pomodoro", 2, ""], ["Fresh Lemonade", 2, ""]]],
  ["T10", "SERVED", 32, [["Crispy Chicken Burger", 2, ""], ["Cappuccino", 2, ""]]],
];

/** Relative popularity of each dish, used to generate believable sales history. */
export const POPULARITY: Record<string, number> = {
  "Classic Burger": 10, Fries: 9, Cola: 8, "Margherita Pizza": 7, Cappuccino: 7, "Crispy Chicken Burger": 5,
  "Spaghetti Pomodoro": 5, "Caesar Salad": 4, "Fresh Lemonade": 4, "Grilled Chicken": 4, "Tomato Soup": 3,
  "Side Salad": 3, "Chocolate Mousse": 3,
};

/** Relative number of orders per hour of the day: a lunch rush and a bigger dinner rush. */
export const HOUR_WEIGHTS: Record<number, number> = {
  11: 2, 12: 8, 13: 9, 14: 4, 15: 1, 17: 3, 18: 7, 19: 10, 20: 9, 21: 4, 22: 1,
};
