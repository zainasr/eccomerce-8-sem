import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./packages/shared/database/schemas/*",
  out: "./packages/shared/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  verbose: true,
  strict: true,
});
