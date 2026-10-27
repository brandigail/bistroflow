import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env.local");
} catch {
  // env vars may already be set (CI / Netlify)
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations need the direct (non-pooled) connection.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
});
