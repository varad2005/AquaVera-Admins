import { Router, type IRouter } from "express";
import { db, auditLogs } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

// GET all logs
router.get("/logs", async (req, res) => {
  try {
    const allLogs = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
    res.json(allLogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
