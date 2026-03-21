import { db, waterRequests, users, auditLogs } from "./index";

async function check() {
  const reqs = await db.select().from(waterRequests);
  const u = await db.select().from(users);
  const logs = await db.select().from(auditLogs);
  
  console.log("Database Check:");
  console.log("- Water Requests:", reqs.length);
  console.log("- Users:", u.length);
  console.log("- Audit Logs:", logs.length);
}

check().catch(console.error);
