import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { isNull, isNotNull, eq, and } from "@workspace/db";

function normalize(s: string | null): string {
  return (s || "").trim().toLowerCase();
}

async function main() {
  console.log("=== PRE-MIGRATION VERIFICATION ===");
  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));
  let allRequests = await db.select().from(waterRequests);
  
  const totalRequests = allRequests.length;
  const nullUserIdCount = allRequests.filter(r => r.userId === null).length;
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Requests with NULL user_id: ${nullUserIdCount}`);
  
  const aadhaarMap = new Map<string, typeof allUsers>();
  const nameMap = new Map<string, typeof allUsers>();

  for (const u of allUsers) {
    if (u.aadhaar) {
      const existing = aadhaarMap.get(u.aadhaar) || [];
      existing.push(u);
      aadhaarMap.set(u.aadhaar, existing);
    }
    if (u.name) {
      const normName = normalize(u.name);
      const existing = nameMap.get(normName) || [];
      existing.push(u);
      nameMap.set(normName, existing);
    }
  }

  const updates: { reqId: string, userId: string }[] = [];
  let skipped = 0;

  for (const req of allRequests) {
    if (req.userId !== null) continue; // Skip already migrated

    const aadhaarMatches = req.aadhaar ? (aadhaarMap.get(req.aadhaar) || []) : [];
    const nameMatches = normalize(req.farmerName) ? (nameMap.get(normalize(req.farmerName)) || []) : [];

    let candidateId = null;

    if (aadhaarMatches.length === 1) {
      candidateId = aadhaarMatches[0].id;
    } else if (nameMatches.length === 1) {
      candidateId = nameMatches[0].id;
    }

    if (candidateId) {
      updates.push({ reqId: req.id, userId: candidateId });
    } else {
      skipped++;
    }
  }

  console.log(`Target Update Count: ${updates.length}`);
  console.log(`Skipped Count: ${skipped}`);
  console.log("==================================\n");

  if (updates.length > 0) {
    console.log("=== EXECUTING MIGRATION ===");
    let successCount = 0;
    try {
      await db.transaction(async (tx) => {
        for (const update of updates) {
          const res = await tx.update(waterRequests)
            .set({ userId: update.userId })
            .where(and(eq(waterRequests.id, update.reqId), isNull(waterRequests.userId)));
          successCount++;
        }
      });
      console.log(`Successfully updated ${successCount} records.`);
    } catch (e: any) {
      console.error(`Migration failed and rolled back: ${e.message}`);
      process.exit(1);
    }
  } else {
    console.log("No records to update.");
  }
  
  console.log("\n=== POST-MIGRATION VERIFICATION ===");
  allRequests = await db.select().from(waterRequests);
  const postTotal = allRequests.length;
  const postNullCount = allRequests.filter(r => r.userId === null).length;
  const postLinkedCount = allRequests.filter(r => r.userId !== null).length;

  console.log(`Total Requests: ${postTotal}`);
  console.log(`Requests with NULL user_id: ${postNullCount}`);
  console.log(`Linked Requests: ${postLinkedCount}`);

  // Check REQ-1013
  const req1013 = allRequests.find(r => r.id === "REQ-1013");
  console.log(`REQ-1013 -> ${req1013?.userId} (Expected F-014)`);

  // Check Amit Patil
  const amitReqs = allRequests.filter(r => r.userId === "F-002");
  console.log(`Amit Patil (F-002) linked requests: ${amitReqs.length} (Expected 11+)`);

  // Check REQ-5353
  const req5353 = allRequests.find(r => r.id === "REQ-5353");
  console.log(`REQ-5353 -> ${req5353?.userId} (Expected null)`);

  const invalidForeignKeys = allRequests.filter(r => r.userId !== null && !allUsers.some(u => u.id === r.userId));
  console.log(`Invalid Foreign Keys (nonexistent/non-farmer user): ${invalidForeignKeys.length}`);

  console.log("\n=== MIGRATION COMPLETED ===");
  process.exit(0);
}

main().catch(console.error);
