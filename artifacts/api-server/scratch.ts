import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, users } from "@workspace/db";
import { eq } from "@workspace/db";

async function main() {
  const admin = await db.select().from(users).where(eq(users.role, "Admin")).limit(1);
  const subAdmin = await db.select().from(users).where(eq(users.role, "Sub-Admin")).limit(1);
  const farmer = await db.select().from(users).where(eq(users.role, "Farmer")).limit(1);

  console.log("Admin:", admin[0]);
  console.log("Sub-Admin:", subAdmin[0]);
  console.log("Farmer:", farmer[0]);
  process.exit(0);
}

main().catch(console.error);
