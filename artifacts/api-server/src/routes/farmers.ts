import { Router } from "express";
import { db, users, waterRequests } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get('/', async (req: any, res: any) => {
  try {
    const allFarmers = await db.select().from(users).where(eq(users.role, 'Farmer'));
    const allRequests = await db.select().from(waterRequests);
    
    // Map users to the structure expected by the frontend
    const mappedFarmers = allFarmers.map(f => {
      const farmerRequests = allRequests.filter(r => r.farmerName === f.name);
      return {
        id: f.id,
        name: f.name,
        aadhaar: f.aadhaar || "N/A",
        landId: f.landRecordId || "N/A",
        village: f.city || "N/A",
        district: f.taluka || "N/A",
        totalRequests: farmerRequests.length,
        activeConnections: farmerRequests.filter(r => r.status === 'Approved').length,
        lastConnection: f.lastLogin || new Date()
      };
    });

    return res.json(mappedFarmers);
  } catch (error: any) {
    logger.error({ error }, "Fetch farmers error");
    return res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

export default router;
