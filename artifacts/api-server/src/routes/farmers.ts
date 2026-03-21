import { Router } from "express";
import { db, farmers } from "@workspace/db";

const router = Router();

router.get('/', async (req: any, res: any) => {
  try {
    const allFarmers = await db.select().from(farmers);
    res.json(allFarmers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

export default router;
