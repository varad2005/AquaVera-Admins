import path from "path";
import dotenv from "dotenv";
import { readFileSync } from "fs";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    const sql1 = readFileSync("../../lib/db/drizzle/0001_phase0_security.sql", "utf8");
    await pool.query(sql1);
    console.log("✅ 0001 applied");

    const sql2 = readFileSync("../../lib/db/drizzle/0002_phase1_production.sql", "utf8");
    await pool.query(sql2);
    console.log("✅ 0002 applied");
  } catch (e: any) {
    console.error("❌ Migration failed:", e.message);
  } finally {
    await pool.end();
  }
}

main();
