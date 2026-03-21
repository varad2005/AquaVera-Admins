import { Router, type IRouter } from "express";
import { db, users } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// GET all users
router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST new user
router.post("/users", async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.id) {
      // Generate a simple ID like USR-123 if not provided
      data.id = `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
    const newUser = await db.insert(users).values(data).returning();
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PATCH user
router.patch("/users/:id", async (req, res) => {
  try {
    const updated = await db.update(users)
      .set(req.body)
      .where(eq(users.id, req.params.id))
      .returning();
    
    if (!updated.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await db.delete(users)
      .where(eq(users.id, req.params.id))
      .returning();
    
    if (!deleted.length) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
