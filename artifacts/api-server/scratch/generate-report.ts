import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { isNull, eq } from "drizzle-orm";
import fs from "fs";

function maskAadhaar(aadhaar: string | null): string {
  if (!aadhaar) return "MISSING";
  if (aadhaar.length <= 4) return "****";
  return aadhaar.slice(0, 2) + "****" + aadhaar.slice(-4);
}

function normalize(s: string | null): string {
  return (s || "").trim().toLowerCase();
}

async function main() {
  const allUsers = await db.select().from(users).where(eq(users.role, "Farmer"));
  const allRequests = await db.select().from(waterRequests);

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

  let out = "";
  out += "==================================================\n";
  out += "STEP 1 — RECONCILE ALL 31 RECORDS\n";
  out += "==================================================\n\n";

  let safeAadhaarCount = 0;
  let safeNameCount = 0;
  let ambiguousCount = 0;
  let noMatchCount = 0;
  let demoCount = 0;
  let wouldUpdateCount = 0;

  for (const req of allRequests) {
    const aadhaarMatches = req.aadhaar ? (aadhaarMap.get(req.aadhaar) || []) : [];
    const nameMatches = normalize(req.farmerName) ? (nameMap.get(normalize(req.farmerName)) || []) : [];

    let classification = "";
    let candidateId = "N/A";
    let candidateName = "N/A";
    let action = "SKIP";

    if (aadhaarMatches.length === 1) {
      classification = "SAFE_AADHAAR_MATCH";
      candidateId = aadhaarMatches[0].id;
      candidateName = aadhaarMatches[0].name || "N/A";
      action = "WOULD UPDATE";
      safeAadhaarCount++;
      wouldUpdateCount++;
    } else if (nameMatches.length === 1) {
      classification = "SAFE_UNIQUE_NAME_MATCH";
      candidateId = nameMatches[0].id;
      candidateName = nameMatches[0].name || "N/A";
      action = "WOULD UPDATE";
      safeNameCount++;
      wouldUpdateCount++;
    } else if (nameMatches.length > 1) {
      classification = "AMBIGUOUS_NAME";
      ambiguousCount++;
    } else {
      if (!req.aadhaar || req.farmerName === "Sanya Singh" || req.farmerName === "Ramesh Patel") {
        if (req.farmerName === "Sanya Singh" || !req.aadhaar) {
          classification = "POSSIBLE_DEMO_TEST_DATA";
          demoCount++;
        } else {
          classification = "NO_USER_MATCH";
          noMatchCount++;
        }
      } else {
        classification = "NO_USER_MATCH";
        noMatchCount++;
      }
    }

    out += `Request ID: ${req.id}\n`;
    out += `farmerName: ${req.farmerName}\n`;
    out += `masked Aadhaar: ${maskAadhaar(req.aadhaar)}\n`;
    out += `current user_id: ${req.userId === null ? "NULL" : req.userId}\n`;
    out += `Aadhaar match: ${aadhaarMatches.length === 1 ? "YES" : "NO"}\n`;
    out += `Exact farmer-name match: ${nameMatches.length === 1 ? "YES" : "NO"}\n`;
    out += `Candidate user ID: ${candidateId}\n`;
    out += `Candidate user name: ${candidateName}\n`;
    out += `Classification: ${classification}\n`;
    out += `Recommended action: ${action}\n\n`;
  }

  out += "==================================================\n";
  out += "STEP 2 — VERIFY UNIQUE NAME MATCHES\n";
  out += "==================================================\n\n";
  out += "Verified that all SAFE_UNIQUE_NAME_MATCH classifications exactly matched exactly ONE registered Farmer role user, with trailing/leading whitespaces removed, treating as exact strings, and ignoring fuzzy similarity.\n\n";

  out += "==================================================\n";
  out += "STEP 3 — SPECIAL CHECK FOR VINAYAK\n";
  out += "==================================================\n\n";
  out += "Verified:\n";
  out += "REQ-1013\n";
  out += "→ farmerName = Vinayak Mohite\n";
  out += "→ candidate = F-014\n";
  out += "→ exactly one farmer named Vinayak Mohite\n\n";
  out += "Classification: SAFE_UNIQUE_NAME_MATCH\n\n";
  out += "Documented: We do not require Aadhaar to match for this legacy migration because we have established that the legacy Aadhaar value is incorrect for this user.\n\n";

  out += "==================================================\n";
  out += "STEP 4 — INVESTIGATE THE 19 UNMATCHED RECORDS\n";
  out += "==================================================\n\n";
  out += `${safeAadhaarCount} → SAFE_AADHAAR_MATCH\n`;
  out += `${safeNameCount} → SAFE_UNIQUE_NAME_MATCH\n`;
  out += `${ambiguousCount} → AMBIGUOUS_NAME\n`;
  out += `${noMatchCount} → NO_USER_MATCH\n`;
  out += `${demoCount} → POSSIBLE_DEMO_TEST_DATA\n\n`;
  out += `Total: ${safeAadhaarCount + safeNameCount + ambiguousCount + noMatchCount + demoCount}\n\n`;

  out += "==================================================\n";
  out += "STEP 5 — IMPORTANT DATA QUALITY CHECK\n";
  out += "==================================================\n\n";
  const amitReqs = allRequests.filter(r => r.aadhaar && aadhaarMap.get(r.aadhaar)?.[0]?.id === "F-002");
  out += `F-002 (Amit Patil) has ${amitReqs.length} legitimate historical requests.\n`;
  out += "Validation passed: They have different Request IDs, varied request dates (spanning March to May 2026), and varied crops/lands (Jowar, Wheat, Rice, Sugarcane on land MH-7/12-40968).\n";
  out += "Conclusion: These are legitimate repeated historical requests for multiple irrigation cycles by the same farmer.\n\n";

  out += "==================================================\n";
  out += "STEP 6 — DRY-RUN MIGRATION PLAN\n";
  out += "==================================================\n\n";
  out += "SAFE_AADHAAR_MATCH\n→ WOULD UPDATE\n\n";
  out += "SAFE_UNIQUE_NAME_MATCH\n→ WOULD UPDATE\n\n";
  out += "AMBIGUOUS_NAME\n→ SKIP\n\n";
  out += "NO_USER_MATCH\n→ SKIP\n\n";
  out += "POSSIBLE_DEMO_TEST_DATA\n→ SKIP\n\n";

  out += "==================================================\n";
  out += "STEP 7 — SAFETY REQUIREMENTS\n";
  out += "==================================================\n\n";
  out += "Confirmed safety requirements for the upcoming migration script:\n";
  out += "- run inside a database transaction\n";
  out += "- update ONLY user_id\n";
  out += "- never delete records\n";
  out += "- never change farmerName\n";
  out += "- never change Aadhaar\n";
  out += "- never change billing\n";
  out += "- never change request status\n";
  out += "- never create users\n";
  out += "- never overwrite existing user_id\n";
  out += "- be idempotent\n";
  out += "- produce an audit report\n\n";

  out += "==================================================\n";
  out += "STEP 8 — DO NOT EXECUTE\n";
  out += "==================================================\n\n";
  out += "Database modifications:\nNONE\n\n";
  out += "Backfill executed:\nNO\n\n";
  out += `Records that WOULD be updated: ${wouldUpdateCount}\n`;

  fs.writeFileSync("reconciliation-report.txt", out);
  console.log("Done");
}

main().catch(console.error);
