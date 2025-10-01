import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schemas";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://ecommerce_user:ecommerce_password@localhost:5433/ecommerce_db";

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
