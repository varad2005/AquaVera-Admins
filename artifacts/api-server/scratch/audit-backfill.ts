import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { isNull, isNotNull, eq } from "drizzle-orm";

function maskAadhaar(aadhaar: string | null): string {
  if (!aadhaar) return "MISSING";
  if (aadhaar.length <= 4) return "****";
  return aadhaar.slice(0, 2) + "****" + aadhaar.slice(-4);
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  console.log(`=== Phase 1 User ID Backfill${isDryRun ? " (DRY RUN)" : ""} ===\n`);

  const allRequests = await db.select().from(waterRequests);
  const totalRequests = allRequests.length;
  const alreadyLinked = allRequests.filter(r => r.userId !== null).length;

  const unlinked = await db
    .select()
    .from(waterRequests)
    .where(isNull(waterRequests.userId));

  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Already Linked: ${alreadyLinked}`);
  console.log(`Found ${unlinked.length} requests with NULL user_id\n`);

  if (unlinked.length === 0) {
    console.log("Nothing to backfill. All requests already have a user_id.");
    process.exit(0);
  }

  // Fetch all farmers indexed by aadhaar
  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));

  // Build aadhaar → users map
  const aadhaarMap = new Map<string, typeof allUsers>();
  for (const u of allUsers) {
    if (!u.aadhaar) continue;
    const existing = aadhaarMap.get(u.aadhaar) || [];
    existing.push(u);
    aadhaarMap.set(u.aadhaar, existing);
  }

  const report = {
    updated: [] as string[],
    ambiguous: [] as any[],
    unmatched: [] as any[],
    noAadhaar: [] as string[],
  };

  for (const req of unlinked) {
    if (!req.aadhaar) {
      report.noAadhaar.push(req.id);
      continue;
    }

    const matches = aadhaarMap.get(req.aadhaar);

    if (!matches || matches.length === 0) {
      report.unmatched.push({ requestId: req.id, aadhaar: maskAadhaar(req.aadhaar) });
      continue;
    }

    if (matches.length > 1) {
      report.ambiguous.push({
        requestId: req.id,
        aadhaar: maskAadhaar(req.aadhaar),
        matches: matches.map((u: any) => `${u.id} (${u.name})`),
      });
      continue;
    }

    // Exactly one match
    const matchedUser = matches[0];
    
    if (!isDryRun) {
      await db
        .update(waterRequests)
        .set({ userId: matchedUser.id })
        .where(eq(waterRequests.id, req.id));
    }

    report.updated.push(`[WOULD UPDATE] Request: ${req.id} → User: ${matchedUser.id} (${matchedUser.name})`);
  }

  console.log("=== BACKFILL REPORT ===\n");
  console.log(`✅ WOULD UPDATE (${report.updated.length}):`);
  report.updated.forEach(r => console.log(`   ${r}`));

  console.log(`\n⚠️  AMBIGUOUS — SKIPPED (${report.ambiguous.length}):`);
  report.ambiguous.forEach(r => console.log(`   Request: ${r.requestId}  Aadhaar: ${r.aadhaar} Matches: ${r.matches.join(", ")}`));

  console.log(`\n❌ UNMATCHED — SKIPPED (${report.unmatched.length}):`);
  report.unmatched.forEach(r => console.log(`   Request: ${r.requestId}  Aadhaar: ${r.aadhaar}`));

  console.log(`\n⛔  NO AADHAAR — SKIPPED (${report.noAadhaar.length}):`);
  report.noAadhaar.forEach(id => console.log(`   Request: ${id}`));

  console.log(`\nSummary: ${report.updated.length} potential matches, ${report.ambiguous.length} ambiguous, ${report.unmatched.length} unmatched, ${report.noAadhaar.length} missing aadhaar`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
