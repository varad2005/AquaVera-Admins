import { Router, type IRouter } from "express";
import { db, users } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// POST login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.password, password)));

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status === "Inactive") {
      return res.status(401).json({ error: "Account is inactive" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    // Check if user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const id = `USR-${Math.floor(Math.random() * 90000) + 10000}`;
    const [newUser] = await db.insert(users).values({
      id,
      name: fullName,
      email,
      phone,
      password,
      role: "Farmer",
      status: "Active",
      isProfileComplete: 0
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed" });
  }
});

// PATCH user profile (farmers)
router.patch("/users/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { 
      ...req.body, 
      isProfileComplete: 1 
    };
    
    const updated = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password: _, ...user } = updated[0];
    return res.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});
router.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    return res.json(allUsers);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
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
    return res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
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
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(updated[0]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await db.delete(users)
      .where(eq(users.id, req.params.id))
      .returning();
    
    if (!deleted.length) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
