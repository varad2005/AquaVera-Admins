import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { isNull, eq } from "@workspace/db";

function maskAadhaar(aadhaar: string | null): string {
  if (!aadhaar) return "MISSING";
  if (aadhaar.length <= 4) return "****";
  return aadhaar.slice(0, 2) + "****" + aadhaar.slice(-4);
}

async function main() {
  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));
  const unlinkedReqs = await db.select().from(waterRequests).where(isNull(waterRequests.userId));

  const vinayak = allUsers.find(u => u.id === "F-014");
  
  console.log(`Vinayak user ID: ${vinayak?.id}`);
  console.log(`Vinayak email: ${vinayak?.email}`);
  console.log(`Vinayak Aadhaar (raw): ${vinayak?.aadhaar}`);
  console.log(`Vinayak Aadhaar (masked): ${maskAadhaar(vinayak?.aadhaar || null)}\n`);

  console.log("=== UNMATCHED INVESTIGATION ===\n");
  for (const req of unlinkedReqs) {
    // Exact match based on Aadhaar
    const exactMatch = allUsers.find(u => u.aadhaar === req.aadhaar);
    
    // Fuzzy/Name match to see what happened to the unmatched records
    const nameMatch = allUsers.find(u => u.name?.toLowerCase().includes(req.farmerName?.toLowerCase() || "") || req.farmerName?.toLowerCase().includes(u.name?.toLowerCase() || ""));

    if (req.farmerName?.toLowerCase().includes("vinayak") || nameMatch?.id === "F-014") {
      console.log(`[VINAYAK] Request ID: ${req.id}`);
      console.log(`[VINAYAK] farmerName: ${req.farmerName}`);
      console.log(`[VINAYAK] Request Aadhaar: ${req.aadhaar}`);
      console.log(`[VINAYAK] Request Aadhaar (masked): ${maskAadhaar(req.aadhaar)}`);
      console.log(`[VINAYAK] Current user_id: ${req.userId}`);
      console.log(`[VINAYAK] Exact Match: ${exactMatch ? `YES (${exactMatch.id})` : "NO"}`);
      if (!exactMatch && nameMatch) {
        console.log(`[VINAYAK] Reason Unmatched: Aadhaar mismatch (User: ${nameMatch.aadhaar} vs Req: ${req.aadhaar})`);
      }
      console.log("");
    } else if (!exactMatch) {
      console.log(`[UNMATCHED] Request ID: ${req.id} | Name: ${req.farmerName} | Req Aadhaar: ${req.aadhaar}`);
      if (nameMatch) {
         console.log(`   -> Found Name Match: ${nameMatch.id} (${nameMatch.name}) | User Aadhaar: ${nameMatch.aadhaar}`);
      } else {
         console.log(`   -> NO User found with similar name. Maybe deleted or test data?`);
      }
    }
  }

  process.exit(0);
}

main().catch(console.error);
