import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests, users } from "../../../lib/db/src/index.ts";
import { isNull, eq } from "drizzle-orm";

function maskAadhaar(aadhaar: string | null): string {
  if (!aadhaar) return "MISSING";
  if (aadhaar.length <= 4) return "****";
  return aadhaar.slice(0, 2) + "****" + aadhaar.slice(-4);
}

function normalize(s: string | null): string {
  if (!s) return "";
  return s.trim().toLowerCase();
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

  let safeAadhaarCount = 0;
  let safeNameCount = 0;
  let ambiguousCount = 0;
  let noMatchCount = 0;
  let demoCount = 0;

  console.log("==================================================");
  console.log("STEP 1 — RECONCILE ALL 31 RECORDS");
  console.log("==================================================\n");

  for (const req of allRequests) {
    let classification = "UNCLASSIFIED";
    let candidateId = "N/A";
    let candidateName = "N/A";
    let aadhaarMatch = "NO";
    let nameMatchStr = "NO";

    const aadhaarMatches = req.aadhaar ? (aadhaarMap.get(req.aadhaar) || []) : [];
    const normReqName = normalize(req.farmerName);
    const nameMatches = normReqName ? (nameMap.get(normReqName) || []) : [];

    if (aadhaarMatches.length === 1) {
      classification = "SAFE_AADHAAR_MATCH";
      candidateId = aadhaarMatches[0].id;
      candidateName = aadhaarMatches[0].name || "N/A";
      aadhaarMatch = "YES";
      safeAadhaarCount++;
    } else if (nameMatches.length === 1) {
      classification = "SAFE_UNIQUE_NAME_MATCH";
      candidateId = nameMatches[0].id;
      candidateName = nameMatches[0].name || "N/A";
      nameMatchStr = "YES";
      safeNameCount++;
    } else if (nameMatches.length > 1) {
      classification = "AMBIGUOUS_NAME";
      ambiguousCount++;
    } else {
      if (req.farmerName?.includes("Test") || req.farmerName === "Sanya Singh") {
         classification = "POSSIBLE_DEMO_TEST_DATA";
         demoCount++;
      } else {
         classification = "NO_USER_MATCH";
         noMatchCount++;
      }
    }

    console.log(`Request ID: ${req.id}`);
    console.log(`farmerName: ${req.farmerName}`);
    console.log(`masked Aadhaar: ${maskAadhaar(req.aadhaar)}`);
    console.log(`current user_id: ${req.userId === null ? "NULL" : req.userId}`);
    console.log(`Aadhaar match: ${aadhaarMatch}`);
    console.log(`Exact farmer-name match: ${nameMatchStr}`);
    console.log(`Candidate user ID: ${candidateId}`);
    console.log(`Candidate user name: ${candidateName}`);
    console.log(`Classification: ${classification}`);
    console.log(`Recommended action: ${["SAFE_AADHAAR_MATCH", "SAFE_UNIQUE_NAME_MATCH"].includes(classification) ? "WOULD UPDATE" : "SKIP"}\n`);
  }

  console.log("==================================================");
  console.log("STEP 3 — SPECIAL CHECK FOR VINAYAK");
  console.log("==================================================\n");
  const vinayakReq = allRequests.find(r => r.farmerName === "Vinayak Mohite");
  if (vinayakReq) {
    const vinayakUsers = nameMap.get(normalize("Vinayak Mohite")) || [];
    console.log(`REQ-1013 (farmerName = ${vinayakReq.farmerName}) -> ${vinayakUsers.length} matched users.`);
    if (vinayakUsers.length === 1) {
      console.log(`Confirmed candidate: ${vinayakUsers[0].id} (${vinayakUsers[0].name})`);
    }
  }

  console.log("\n==================================================");
  console.log("STEP 4 — INVESTIGATE THE 19 UNMATCHED RECORDS (now updated counts)");
  console.log("==================================================\n");
  console.log(`SAFE_AADHAAR_MATCH: ${safeAadhaarCount}`);
  console.log(`SAFE_UNIQUE_NAME_MATCH: ${safeNameCount}`);
  console.log(`AMBIGUOUS_NAME: ${ambiguousCount}`);
  console.log(`NO_USER_MATCH: ${noMatchCount}`);
  console.log(`POSSIBLE_DEMO_TEST_DATA: ${demoCount}`);
  console.log(`TOTAL: ${safeAadhaarCount + safeNameCount + ambiguousCount + noMatchCount + demoCount}`);

  console.log("\n==================================================");
  console.log("STEP 5 — IMPORTANT DATA QUALITY CHECK");
  console.log("==================================================\n");
  const amitReqs = allRequests.filter(r => r.aadhaar && aadhaarMap.get(r.aadhaar)?.[0]?.id === "F-002");
  console.log(`Found ${amitReqs.length} requests matching Amit Patil.`);
  for (const r of amitReqs) {
    console.log(`- Request ID: ${r.id}, Date: ${r.startDate?.toISOString().slice(0, 10)}, Crop: ${r.cropType}, Land: ${r.landId}`);
  }
}

main().catch(console.error);
