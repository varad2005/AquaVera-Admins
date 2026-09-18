import { Router, type IRouter } from "express";
import { db, bills, payments, waterRequests } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const router: IRouter = Router();

// Pagination helper
function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// GET /billing — list bills for authenticated user (Farmer: own, Admin: all)
router.get("/billing", requireAuth, async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>);

    let query = db.select().from(bills).$dynamic();
    if (req.user!.role === "Farmer") {
      query = query.where(eq(bills.userId, req.user!.id));
    }

    const allBills = await query.limit(limit).offset(offset);
    const total = await db.$count(bills);

    return res.json({
      data: allBills,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch bills" });
  }
});

// GET /billing/:id — get a specific bill
router.get("/billing/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid bill ID" });

    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    if (req.user!.role === "Farmer" && bill.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.json(bill);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch bill" });
  }
});

// POST /billing/:id/pay — mark bill as paid (MOCK — future gateway integration point)
// NOTE: This is a MOCK payment implementation. Bills must never be marked paid
// solely based on frontend input. In production this will be driven by webhook.
router.post("/billing/:id/pay", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid bill ID" });

    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    // IDOR: farmers can only pay their own bills
    if (req.user!.role === "Farmer" && bill.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (bill.status === "Paid" || bill.status === "Cancelled") {
      return res.status(409).json({ error: `Bill is already ${bill.status}` });
    }

    // MOCK: create a payment record and mark bill paid
    const [payment] = await db
      .insert(payments)
      .values({
        billId: bill.id,
        userId: bill.userId,
        amount: bill.amount,
        status: "Completed",
        provider: "Mock",
        providerTransactionId: `MOCK-${Date.now()}`,
      })
      .returning();

    const [updatedBill] = await db
      .update(bills)
      .set({ status: "Paid", paidAt: new Date() })
      .where(eq(bills.id, id))
      .returning();

    // Keep legacy paymentStatus in sync on the water_request
    await db
      .update(waterRequests)
      .set({ paymentStatus: "Paid" })
      .where(eq(waterRequests.id, bill.requestId));

    return res.json({ bill: updatedBill, payment });
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Payment failed" });
  }
});

// GET /payments — list payments (Admin: all, Farmer: own)
router.get("/payments", requireAuth, async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>);

    let query = db.select().from(payments).$dynamic();
    if (req.user!.role === "Farmer") {
      query = query.where(eq(payments.userId, req.user!.id));
    }

    const allPayments = await query.limit(limit).offset(offset);
    const total = await db.$count(payments);

    return res.json({
      data: allPayments,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
});

export default router;
