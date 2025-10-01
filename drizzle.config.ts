import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./packages/shared/database/schemas/*",
  out: "./packages/shared/database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://ecommerce_user:ecommerce_password@localhost:5433/ecommerce_db",
  },
  verbose: true,
  strict: true,
});
