import path from "path";
import dotenv from "dotenv";
import { readFileSync } from "fs";
dotenv.config({ path: path.resolve(process.cwd(), "artifacts/api-server/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// @ts-ignore
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const sql = readFileSync("lib/db/drizzle/0001_phase0_security.sql", "utf8");

pool.query(sql)
  .then(() => {
    console.log("✅ Migration 0001_phase0_security.sql applied successfully");
    pool.end();
  })
  .catch((e: any) => {
    console.error("❌ Migration failed:", e.message);
    pool.end();
    process.exit(1);
  });
