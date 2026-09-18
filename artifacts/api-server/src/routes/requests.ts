import { Router, type IRouter } from "express";
import { db, waterRequests, bills, auditLogs, type InsertRequest } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

async function writeAuditLog(
  user: string,
  action: string,
  ip: string,
  role: string
) {
  await db.insert(auditLogs).values({ user, action, ip, role });
}

function getIp(req: { ip?: string; socket?: { remoteAddress?: string } }): string {
  return (req as any).ip || (req as any).socket?.remoteAddress || "unknown";
}

// ── Rate table (server-side billing) ─────────────────────────────────────────

const RATES: Record<string, Record<string, number>> = {
  "Food Grains & Other Crops": { kharif: 600, rabi: 1200, hot: 1800 },
  "Sugarcane & Banana": { kharif: 1890, rabi: 3780, hot: 5670 },
  Cotton: { kharif: 810, rabi: 1620, hot: 2430 },
  Horticulture: { kharif: 1422, rabi: 2844, hot: 4266 },
};

// ── Zod schemas ───────────────────────────────────────────────────────────────

const createRequestSchema = z.object({
  farmerName: z.string().min(1),
  aadhaar: z.string().min(1),
  landId: z.string().min(1),
  village: z.string().min(1),
  district: z.string().min(1),
  category: z.enum([
    "Food Grains & Other Crops",
    "Sugarcane & Banana",
    "Cotton",
    "Horticulture",
  ]),
  crop: z.string().min(1),
  season: z.enum(["kharif", "rabi", "hot"]),
  area: z.number().positive(),
  verificationData: z
    .object({
      imagePath: z.string().nullish(),
      imageMime: z.string().nullish(),
      imageSize: z.number().nullish(),
      latitude: z.number().nullish(),
      longitude: z.number().nullish(),
      device: z.string().nullish(),
    })
    .optional(),
});

const patchStatusSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected", "Flagged"]),
});

const bulkPaySchema = z.object({
  farmerName: z.string().min(1),
});

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /requests — paginated list
router.get("/requests", requireAuth, async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>);

    let query = db.select().from(waterRequests).$dynamic();
    let countQuery = db.select({ count: count() }).from(waterRequests).$dynamic();

    // IDOR protection: farmers only see their own requests
    if (req.user!.role === "Farmer") {
      query = query.where(eq(waterRequests.userId, req.user!.id));
      countQuery = countQuery.where(eq(waterRequests.userId, req.user!.id));
    }

    const [data, [{ count: total }]] = await Promise.all([
      query.orderBy(waterRequests.timestamp).limit(limit).offset(offset),
      countQuery
    ]);

    return res.json({
      data,
      pagination: { page, limit, total: Number(total) },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// GET /requests/:id
router.get("/requests/:id", requireAuth, async (req, res) => {
  try {
    const [request] = await db
      .select()
      .from(waterRequests)
      .where(eq(waterRequests.id, req.params.id as string));

    if (!request) return res.status(404).json({ error: "Request not found" });

    // IDOR protection
    if (req.user!.role === "Farmer" && request.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden: cannot view another farmer's request" });
    }

    return res.json(request);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch request" });
  }
});

// POST /requests/pay-all — bulk pay for a farmer (Admin only, deprecated legacy path)
router.post(
  "/requests/pay-all",
  requireAuth,
  requireRole(["Admin", "Sub-Admin"]),
  async (req, res) => {
    try {
      const { farmerName } = bulkPaySchema.parse(req.body);
      const updated = await db
        .update(waterRequests)
        .set({ paymentStatus: "Paid" })
        .where(eq(waterRequests.farmerName, farmerName))
        .returning();

      await writeAuditLog(
        req.user!.email,
        `Bulk pay-all for farmer: ${farmerName} (${updated.length} records)`,
        getIp(req),
        req.user!.role
      );

      return res.json({ count: updated.length });
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      return res.status(500).json({ error: "Failed to update bulk payments" });
    }
  }
);

// PATCH /requests/:id/pay — mark single request paid (Admin only, legacy compat)
router.patch(
  "/requests/:id/pay",
  requireAuth,
  requireRole(["Admin", "Sub-Admin"]),
  async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await db
        .update(waterRequests)
        .set({ paymentStatus: "Paid" })
        .where(eq(waterRequests.id, id as string))
        .returning();

      if (!updated.length) return res.status(404).json({ error: "Request not found" });

      await writeAuditLog(
        req.user!.email,
        `Marked request ${id} as paid (legacy path)`,
        getIp(req),
        req.user!.role
      );

      return res.json(updated[0]);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update payment status" });
    }
  }
);

// PATCH /requests/:id — update status (Admin only)
router.patch(
  "/requests/:id",
  requireAuth,
  requireRole(["Admin", "Sub-Admin"]),
  async (req, res) => {
    try {
      const { status } = patchStatusSchema.parse(req.body);
      const updated = await db
        .update(waterRequests)
        .set({ status })
        .where(eq(waterRequests.id, req.params.id as string))
        .returning();

      if (!updated.length) return res.status(404).json({ error: "Request not found" });

      await writeAuditLog(
        req.user!.email,
        `Updated request ${req.params.id} status to ${status}`,
        getIp(req),
        req.user!.role
      );

      return res.json(updated[0]);
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      return res.status(500).json({ error: "Failed to update request" });
    }
  }
);

// POST /requests — create new request (Farmer only, but allowed for Admin for testing)
router.post("/requests", requireAuth, requireRole(["Farmer", "Admin", "Sub-Admin"]), async (req, res) => {
  try {
    const data = createRequestSchema.parse(req.body);
    const id = `REQ-${Math.floor(Math.random() * 9000) + 1000}`;

    // Server-side billing calculation — never trust frontend value
    const ratePerHa = RATES[data.category]?.[data.season];
    if (!ratePerHa) {
      return res.status(400).json({ error: "Invalid category or season" });
    }
    const finalBill = Math.round(ratePerHa * data.area);

    const newRequest: InsertRequest = {
      id,
      userId: req.user!.id, // Bind securely to authenticated user
      farmerName: data.farmerName,
      aadhaar: data.aadhaar,
      landId: data.landId,
      village: data.village,
      district: data.district,
      cropType: `${data.crop} (${data.category})`,
      durationHours: 8,
      startDate: new Date(),
      calculatedBilling: finalBill,    // Legacy compat field
      
      // Mock AI Analysis heuristic:
      // Since we don't have a real computer vision model running, we can guess based on the device!
      // If it's a desktop (Windows/Mac), they are likely testing indoors (no crop). 
      // If it's a mobile device (Android/iPhone), they are likely in the field.
      confidenceScore: data.verificationData?.device?.match(/android|iphone|ipad/i) 
        ? Math.floor(Math.random() * 10) + 90  // 90-99% for mobile (likely in field with crops)
        : Math.floor(Math.random() * 30) + 40, // 40-69% for desktop (likely indoors taking a selfie)
        
      ndviIndex: Number((Math.random() * 0.5 + 0.3).toFixed(2)), // Mock AI
      
      geoStatus: data.verificationData?.device?.match(/android|iphone|ipad/i) ? "Valid" : "Invalid",
      status: "Pending",
      paymentStatus: "Unpaid",         // Legacy compat field
      
      // Supabase Storage fields (preferred going forward)
      evidenceImagePath: data.verificationData?.imagePath || null,
      evidenceImageMime: data.verificationData?.imageMime || null,
      evidenceImageSize: data.verificationData?.imageSize || null,
      // Legacy Base64 field — no longer accepted here; only path is stored
      evidenceImage: null,
      latitude: data.verificationData?.latitude || null,
      longitude: data.verificationData?.longitude || null,
      deviceInfo: data.verificationData?.device || null,
      timestamp: new Date(),
    };

    const [inserted] = await db.insert(waterRequests).values(newRequest).returning();

    // Create a normalized bill record (future source of truth)
    await db.insert(bills).values({
      requestId: inserted.id,
      userId: req.user!.id,
      amount: finalBill,
      status: "Generated",
    });

    await writeAuditLog(
      req.user!.email,
      `Created request ${inserted.id} for area ${data.area} ha, bill ₹${finalBill}`,
      getIp(req),
      req.user!.role
    );

    return res.status(201).json(inserted);
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    console.error("Error creating request:", error);
    return res.status(500).json({ error: "Failed to create request" });
  }
});

export default router;
