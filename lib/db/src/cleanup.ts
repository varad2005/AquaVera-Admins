import { pool } from "./index";

async function main() {
  const client = await pool.connect();
  try {
    console.log("Dropping existing tables and types...");
    await client.query(`
      DROP TABLE IF EXISTS "audit_logs";
      DROP TABLE IF EXISTS "farmers";
      DROP TABLE IF EXISTS "water_requests";
      DROP TABLE IF EXISTS "users";
      DROP TABLE IF EXISTS "__drizzle_migrations";
      
      DROP TYPE IF EXISTS "geo_status";
      DROP TYPE IF EXISTS "request_status";
      DROP TYPE IF EXISTS "user_status";
    `);
    console.log("Cleanup complete!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
