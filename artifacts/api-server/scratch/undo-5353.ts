import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, waterRequests } from "../../../lib/db/src/index.ts";
import { eq } from "@workspace/db";

async function main() {
  await db.update(waterRequests).set({ userId: null }).where(eq(waterRequests.id, "REQ-5353"));
  console.log("Undid REQ-5353.");
  process.exit(0);
}

main().catch(console.error);
