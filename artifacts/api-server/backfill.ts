/**
 * Phase 1 Safe Backfill Script
 *
 * Safely links legacy water_requests rows (user_id IS NULL) to users by
 * matching on aadhaar. Only updates rows where EXACTLY ONE user matches.
 * Ambiguous and unmatched records are preserved and reported — never modified.
 *
 * Run: npx tsx scripts/backfill-user-id.ts
 */

import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "@workspace/db";
import { isNull, eq } from "@workspace/db";

async function main() {
  console.log("=== Phase 1 User ID Backfill ===\n");

  // Fetch all requests with no user_id
  const unlinked = await db
    .select()
    .from(waterRequests)
    .where(isNull(waterRequests.userId));

  console.log(`Found ${unlinked.length} requests with NULL user_id\n`);

  if (unlinked.length === 0) {
    console.log("Nothing to backfill. All requests already have a user_id.");
    process.exit(0);
  }

  // Fetch all farmers indexed by aadhaar
  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));

  // Build aadhaar → users map (handling duplicates)
  const aadhaarMap = new Map<string, typeof allUsers>();
  for (const u of allUsers) {
    if (!u.aadhaar) continue;
    const existing = aadhaarMap.get(u.aadhaar) || [];
    existing.push(u);
    aadhaarMap.set(u.aadhaar, existing);
  }

  const report: {
    updated: string[];
    ambiguous: { requestId: string; aadhaar: string; matches: string[] }[];
    unmatched: { requestId: string; aadhaar: string }[];
    noAadhaar: string[];
  } = {
    updated: [],
    ambiguous: [],
    unmatched: [],
    noAadhaar: [],
  };

  for (const req of unlinked) {
    if (!req.aadhaar) {
      report.noAadhaar.push(req.id);
      continue;
    }

    const matches = aadhaarMap.get(req.aadhaar);

    if (!matches || matches.length === 0) {
      report.unmatched.push({ requestId: req.id, aadhaar: req.aadhaar });
      continue;
    }

    if (matches.length > 1) {
      report.ambiguous.push({
        requestId: req.id,
        aadhaar: req.aadhaar,
        matches: matches.map((u: any) => `${u.id} (${u.name})`),
      });
      continue;
    }

    // Exactly one match — safe to update
    const matchedUser = matches[0];
    await db
      .update(waterRequests)
      .set({ userId: matchedUser.id })
      .where(eq(waterRequests.id, req.id));

    report.updated.push(`${req.id} → ${matchedUser.id} (${matchedUser.name})`);
  }

  // Print report
  console.log("=== BACKFILL REPORT ===\n");

  console.log(`✅ UPDATED (${report.updated.length}):`);
  report.updated.forEach((r) => console.log(`   ${r}`));

  console.log(`\n⚠️  AMBIGUOUS — NOT UPDATED (${report.ambiguous.length}):`);
  report.ambiguous.forEach((r) => {
    console.log(`   Request: ${r.requestId}  Aadhaar: ${r.aadhaar}`);
    console.log(`   Matches: ${r.matches.join(", ")}`);
  });

  console.log(`\n❌ UNMATCHED — NOT UPDATED (${report.unmatched.length}):`);
  report.unmatched.forEach((r) =>
    console.log(`   Request: ${r.requestId}  Aadhaar: ${r.aadhaar}`)
  );

  console.log(`\n⛔  NO AADHAAR — NOT UPDATED (${report.noAadhaar.length}):`);
  report.noAadhaar.forEach((id) => console.log(`   Request: ${id}`));

  console.log("\n=== DONE ===");
  console.log(
    `\nSummary: ${report.updated.length} linked, ${report.ambiguous.length} ambiguous, ${report.unmatched.length} unmatched, ${report.noAadhaar.length} missing aadhaar`
  );

  process.exit(0);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
