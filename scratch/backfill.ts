import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { db, waterRequests, users } from "@workspace/db";
import { isNull, eq } from "drizzle-orm";

async function main() {
  console.log("=== Phase 1 User ID Backfill ===\n");
  const unlinked = await db.select().from(waterRequests).where(isNull(waterRequests.userId));
  console.log(`Found ${unlinked.length} requests with NULL user_id\n`);

  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));
  const aadhaarMap = new Map<string, typeof allUsers>();
  for (const u of allUsers) {
    if (!u.aadhaar) continue;
    const existing = aadhaarMap.get(u.aadhaar) || [];
    existing.push(u);
    aadhaarMap.set(u.aadhaar, existing);
  }

  const report = { updated: [] as string[], ambiguous: [] as any[], unmatched: [] as any[], noAadhaar: [] as string[] };

  for (const req of unlinked) {
    if (!req.aadhaar) { report.noAadhaar.push(req.id); continue; }
    const matches = aadhaarMap.get(req.aadhaar);
    if (!matches || matches.length === 0) { report.unmatched.push({ requestId: req.id, aadhaar: req.aadhaar }); continue; }
    if (matches.length > 1) { report.ambiguous.push({ requestId: req.id, aadhaar: req.aadhaar, matches: matches.map((u: any) => `${u.id} (${u.name})`) }); continue; }
    
    // Exactly one match — safe to update
    const matchedUser = matches[0];
    await db.update(waterRequests).set({ userId: matchedUser.id }).where(eq(waterRequests.id, req.id));
    report.updated.push(`${req.id} → ${matchedUser.id} (${matchedUser.name})`);
  }

  console.log("=== BACKFILL REPORT ===\n");
  console.log(`✅ UPDATED (${report.updated.length}):`);
  console.log(`\n⚠️  AMBIGUOUS — NOT UPDATED (${report.ambiguous.length}):`);
  console.log(`\n❌ UNMATCHED — NOT UPDATED (${report.unmatched.length}):`);
  console.log(`\n⛔  NO AADHAAR — NOT UPDATED (${report.noAadhaar.length}):`);
  console.log(`\nSummary: ${report.updated.length} linked, ${report.ambiguous.length} ambiguous, ${report.unmatched.length} unmatched, ${report.noAadhaar.length} missing aadhaar`);
  process.exit(0);
}
main();
