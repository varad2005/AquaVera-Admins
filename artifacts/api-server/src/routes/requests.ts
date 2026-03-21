import { Router, type IRouter } from "express";
import { db, waterRequests, type InsertRequest } from "@workspace/db";
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

// GET singe request
router.get("/requests/:id", async (req, res) => {
  try {
    const [request] = await db.select().from(waterRequests).where(eq(waterRequests.id, req.params.id));
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    return res.json(request);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch request" });
  }
});

// POST bulk pay for a farmer
router.post("/requests/pay-all", async (req, res) => {
  const { farmerName } = req.body;
  if (!farmerName) return res.status(400).json({ error: "Farmer name required" });
  
  try {
    const updated = await db.update(waterRequests)
      .set({ paymentStatus: "Paid" })
      .where(eq(waterRequests.farmerName, farmerName))
      .returning();
    return res.json({ count: updated.length });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update bulk payments" });
  }
});

// PATCH request payment status
router.patch("/requests/:id/pay", async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to mark request ${id} as paid...`);
  try {
    const updated = await db.update(waterRequests)
      .set({ paymentStatus: "Paid" })
      .where(eq(waterRequests.id, id))
      .returning();

    if (!updated.length) {
      console.warn(`Request ${id} not found in database.`);
      return res.status(404).json({ error: "Request not found" });
    }
    console.log(`Request ${id} marked as paid successfully.`);
    return res.json(updated[0]);
  } catch (error) {
    console.error(`Error updating payment for ${id}:`, error);
    return res.status(500).json({ error: "Failed to update payment status" });
  }
});

// PATCH request status
router.patch("/requests/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updated = await db.update(waterRequests)
      .set({ status })
      .where(eq(waterRequests.id, req.params.id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "Request not found" });
    }
    return res.json(updated[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update request" });
  }
});
router.post("/requests", async (req, res) => {
  try {
    const data = req.body;
    const id = `REQ-${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Default values if missing
    const newRequest: InsertRequest = {
      id,
      farmerName: data.farmerName || "Anonymous Farmer",
      aadhaar: data.aadhaar || "N/A",
      landId: data.landId || "N/A",
      village: data.village || "N/A",
      district: data.district || "N/A",
      cropType: data.cropType || "Sugarcane",
      durationHours: Number(data.durationHours) || 8,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      calculatedBilling: Number(data.calculatedBilling) || (Number(data.durationHours) || 8) * 150,
      geoStatus: "Pending",
      status: "Pending",
      confidenceScore: Math.floor(Math.random() * 30) + 70, // 70-100
      ndviIndex: Number((Math.random() * 0.5 + 0.3).toFixed(2)), // 0.3-0.8
      evidenceImage: data.verificationData?.image || null,
      latitude: data.verificationData?.latitude || null,
      longitude: data.verificationData?.longitude || null,
      deviceInfo: data.verificationData?.device || null,
      timestamp: new Date(),
    };

    const [inserted] = await db.insert(waterRequests).values(newRequest).returning();
    res.status(201).json(inserted);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
});

export default router;
