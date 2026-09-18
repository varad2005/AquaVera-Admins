import { Router, type IRouter } from "express";
import { db, auditLogs } from "@workspace/db";
import { desc, count } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(query.limit) || 50));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// GET /logs — paginated, Admin/Sub-Admin only
router.get("/logs", requireAuth, requireRole(["Admin", "Sub-Admin"]), async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>);

    const [data, [{ count: total }]] = await Promise.all([
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit).offset(offset),
      db.select({ count: count() }).from(auditLogs),
    ]);

    return res.json({
      data,
      pagination: { page, limit, total: Number(total) },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
