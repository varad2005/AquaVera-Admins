import { Router, type IRouter } from "express";
import { db, waterRequests } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET all requests
router.get("/requests", async (req, res) => {
  try {
    const allRequests = await db.select().from(waterRequests);
    res.json(allRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// GET single request
router.get("/requests/:id", async (req, res) => {
  try {
    const [request] = await db.select().from(waterRequests).where(eq(waterRequests.id, req.params.id));
    if (!request) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

// PATCH request status
router.patch("/requests/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const updated = await db.update(waterRequests)
      .set({ status })
      .where(eq(waterRequests.id, req.params.id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

export default router;
