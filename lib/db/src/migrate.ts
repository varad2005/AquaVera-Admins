import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import path from "path";

async function main() {
  console.log("Running migrations...");
  // Path is relative to the execution context (lib/db/src)
  // But drizzle-kit generates in lib/db/drizzle
  await migrate(db, { 
    migrationsFolder: path.resolve(import.meta.dirname, "../drizzle") 
  });
  console.log("Migrations complete!");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
