const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const wholeMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatMoney(amount: number): string {
  return money.format(amount);
}

/** Whole dollars, for headline figures where cents are noise. */
export function formatWholeMoney(amount: number): string {
  return wholeMoney.format(amount);
}

/** Short money for chart axes: $950, $2.5k. */
export function formatCompactMoney(amount: number): string {
  return amount >= 1000 ? `$${compact.format(amount / 1000)}k` : `$${compact.format(amount)}`;
}
