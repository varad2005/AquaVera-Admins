import { db, users } from "./index";

async function check() {
  const u = await db.select().from(users);
  console.log("Database Check:");
  console.log("- Users:", u.length);
}

check().catch(console.error);

