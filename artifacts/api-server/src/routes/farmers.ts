import { Router } from "express";
import { db, users, waterRequests } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { logger } from "../lib/logger";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

router.get("/", requireAuth, requireRole(["Admin", "Sub-Admin"]), async (req: any, res: any) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);

    const [allFarmers, allRequests, [{ count: total }]] = await Promise.all([
      db.select().from(users).where(eq(users.role, "Farmer")).limit(limit).offset(offset),
      db.select().from(waterRequests),
      db.select({ count: count() }).from(users).where(eq(users.role, "Farmer")),
    ]);

    // Map farmers — join on user_id where available, fallback to farmerName for legacy records
    const mappedFarmers = allFarmers.map((f) => {
      const farmerRequests = allRequests.filter(
        (r) => r.userId === f.id || r.farmerName === f.name
      );
      return {
        id: f.id,
        name: f.name,
        aadhaar: f.aadhaar || "N/A",
        landId: f.landRecordId || "N/A",
        village: f.city || "N/A",
        district: f.taluka || "N/A",
        totalRequests: farmerRequests.length,
        activeConnections: farmerRequests.filter((r) => r.status === "Approved").length,
        lastConnection: f.lastLogin || new Date(),
      };
    });

    return res.json({
      data: mappedFarmers,
      pagination: { page, limit, total: Number(total) },
    });
  } catch (error: any) {
    logger.error({ error }, "Fetch farmers error");
    return res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

export default router;
