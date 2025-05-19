import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../schema/schema";
import dotenv from "dotenv";

dotenv.config();

let db: ReturnType<typeof drizzle>;

try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  db = drizzle(pool, { schema });

  pool.query("SELECT NOW()", (err, result) => {
    if (err) {
      console.error("Failed to connect to PostgreSQL:", err.message);
    } else {
      console.log("PostgreSQL connection successful..!");
    }
  });
} catch (error) {
  console.error("Error initializing DB connection:", (error as Error).message);
  process.exit(1);
}

export { db };
