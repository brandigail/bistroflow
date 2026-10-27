import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  // Pool (WebSocket) rather than the HTTP driver so order + stock updates can share a transaction.
  return drizzle(new Pool({ connectionString: url }));
}

let instance: ReturnType<typeof createDb> | undefined;

export function getDb() {
  instance ??= createDb();
  return instance;
}
