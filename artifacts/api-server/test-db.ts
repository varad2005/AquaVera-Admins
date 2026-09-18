import { db, waterRequests, users } from "@workspace/db";
import { eq } from "@workspace/db";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Total Users:", allUsers.length);
  const vinayak = allUsers.find(u => u.email === "vinayak@farmer.com");
  if (!vinayak) {
    console.log("Vinayak not found!");
    process.exit();
  }
  console.log("Vinayak ID:", vinayak.id);

  const reqs = await db.select().from(waterRequests).where(eq(waterRequests.userId, vinayak.id));
  console.log("Requests for Vinayak:", reqs.length);
  const allReqs = await db.select().from(waterRequests);
  console.log("Total Requests:", allReqs.length);
  console.log("Requests with NULL userId:", allReqs.filter(r => !r.userId).length);
  
  // also check if pagination works as expected in use-mock-api.ts
  process.exit();
}
main();
