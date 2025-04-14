// Make sure to install the 'postgres' package
import { drizzle } from "drizzle-orm/postgres-js";
import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ENV MISSING");
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle({ client: queryClient });
