try {
  process.loadEnvFile(".env.local");
} catch {
  // env already provided
}

async function main() {
  // Imported after the env file is loaded, because the database client reads DATABASE_URL.
  const { seedDemoData } = await import("../db/seed");
  const summary = await seedDemoData();
  console.log(
    `Seeded ${summary.ingredients} ingredients, ${summary.menuItems} menu items, ${summary.tables} tables, ` +
      `${summary.openOrders} open orders and ${summary.historicOrders} historic orders`,
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
