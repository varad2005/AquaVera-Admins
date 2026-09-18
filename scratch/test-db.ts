import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { db, waterRequests, users } from "@workspace/db";
import { isNull, eq, count } from "drizzle-orm";
async function main() {
  try {
    const limit = 20;
    const offset = 0;
    const userId = "USR-004";
    
    let query = db.select().from(waterRequests).$dynamic();
    let countQuery = db.select({ count: count() }).from(waterRequests).$dynamic();

    query = query.where(eq(waterRequests.userId, userId));
    countQuery = countQuery.where(eq(waterRequests.userId, userId));

    const [data, [{ count: total }]] = await Promise.all([
      query.orderBy(waterRequests.timestamp).limit(limit).offset(offset),
      countQuery
    ]);
    console.log("SUCCESS:", data.length);
  } catch (e) {
    console.error("ERROR:", e);
  }
  process.exit();
}
main();
