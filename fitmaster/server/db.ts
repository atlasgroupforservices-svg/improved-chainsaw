import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: any;
let db: any;

// Check if DATABASE_URL is available and valid
if (process.env.DATABASE_URL && process.env.DATABASE_URL !== "postgresql://postgres:password@localhost:5432/fitness") {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (error) {
    console.warn("Failed to connect to database, using memory storage fallback");
    // Create a simple fallback for development
    pool = null;
    db = null;
  }
} else {
  console.warn("DATABASE_URL not set or using default, using memory storage fallback");
  pool = null;
  db = null;
}

export { pool, db };
