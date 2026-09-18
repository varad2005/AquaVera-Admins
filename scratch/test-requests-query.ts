import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests } from "../lib/db/src/index.js";
import { eq, count } from "drizzle-orm";

async function main() {
  try {
    const limit = 20;
    const offset = 0;
    let query = db.select().from(waterRequests).orderBy(waterRequests.timestamp).limit(limit).offset(offset).$dynamic();
    let countQuery = db.select({ count: count() }).from(waterRequests).$dynamic();
    
    // Simulate what happens for admin
    const [data, [{ count: total }]] = await Promise.all([query, countQuery]);
    console.log("Success! Data length:", data.length, "Total:", total);
  } catch (e: any) {
    console.error("Runtime Error:", e.message);
  }
  process.exit(0);
}

main();
