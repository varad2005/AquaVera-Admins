import path from "path";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../artifacts/api-server/.env") });

import pg from "pg";
const { Pool } = pg;

const sql = readFileSync(
  path.resolve(process.cwd(), "../../lib/db/drizzle/0002_phase1_production.sql"),
  "utf8"
);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .query(sql)
  .then(() => {
    console.log("✅ Migration 0002_phase1_production.sql applied successfully");
    pool.end();
  })
  .catch((e) => {
    console.error("❌ Migration failed:", e.message);
    pool.end();
    process.exit(1);
  });
