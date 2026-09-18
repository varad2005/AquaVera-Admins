import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { eq, ilike } from "drizzle-orm";

function maskAadhaar(aadhaar: string | null): string {
  if (!aadhaar) return "MISSING";
  if (aadhaar.length <= 4) return "****";
  return aadhaar.slice(0, 2) + "****" + aadhaar.slice(-4);
}

async function main() {
  const vinayak = await db.select().from(users).where(eq(users.id, "F-014"));
  if (vinayak.length === 0) {
    console.log("Vinayak user not found.");
    process.exit(1);
  }
  const user = vinayak[0];

  const reqs = await db.select().from(waterRequests).where(ilike(waterRequests.farmerName, "%Vinayak%"));

  console.log(`Vinayak user ID: ${user.id}`);
  console.log(`Vinayak Aadhaar (raw): "${user.aadhaar}"`);
  console.log(`Vinayak Aadhaar (masked): ${maskAadhaar(user.aadhaar)}`);
  console.log(`Vinayak Email: ${user.email}`);
  
  console.log(`\nRequests found for Vinayak (by name): ${reqs.length}`);
  let matchable = 0;
  let unmatched = 0;

  for (const req of reqs) {
    const isMatch = req.aadhaar === user.aadhaar;
    if (isMatch) matchable++; else unmatched++;

    console.log(`\nRequest ID: ${req.id}`);
    console.log(`Farmer Name: ${req.farmerName}`);
    console.log(`Raw Aadhaar: "${req.aadhaar}"`);
    console.log(`Masked Aadhaar: ${maskAadhaar(req.aadhaar)}`);
    console.log(`Current user_id: ${req.userId}`);
    console.log(`Exact match: ${isMatch}`);
    if (!isMatch) {
      console.log(`Reason for mismatch: User aadhaar is length ${user.aadhaar?.length || 0}, Request aadhaar is length ${req.aadhaar?.length || 0}`);
    }
  }

  process.exit(0);
}

main().catch(console.error);
