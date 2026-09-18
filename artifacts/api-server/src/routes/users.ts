import { Router, type IRouter } from "express";
import { db, users, auditLogs } from "@workspace/db";
import { eq, count } from "@workspace/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { requireAuth, requireRole } from "../middlewares/auth";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "aquavera-dev-super-secret-key";
const router: IRouter = Router();

function parsePagination(query: Record<string, unknown>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

async function writeAuditLog(user: string, action: string, ip: string, role: string) {
  try {
    await db.insert(auditLogs).values({ user, action, ip, role });
  } catch { /* non-fatal: don't fail the main action */ }
}

function getIp(req: any): string {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

// Zod schemas for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

const adminCreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6).optional(),
  role: z.enum(["Admin", "Sub-Admin", "Farmer"]),
  status: z.enum(["Active", "Inactive"]).optional(),
  department: z.string().optional(),
});

const adminUpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["Admin", "Sub-Admin", "Farmer"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  department: z.string().optional(),
}).strict();

// POST login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({ error: "Account is inactive" });
    }

    // Temporary fallback for plaintext passwords during migration
    let isValid = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // It's a plaintext password from development data
      isValid = user.password === password;
      if (isValid) {
        // Upgrade password hash in background
        const hashed = await bcrypt.hash(password, 10);
        await db.update(users).set({ password: hashed }).where(eq(users.id, user.id));
      }
    }

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Update last login timestamp
    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

    await writeAuditLog(user.email, "Login successful", getIp(req), user.role);

    const { password: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Login Route Error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST signup
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password } = signupSchema.parse(req.body);
    
    // Check if user already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `USR-${Math.floor(Math.random() * 90000) + 10000}`; // Should ideally use UUID in the future

    const [newUser] = await db.insert(users).values({
      id,
      name: fullName,
      email,
      phone,
      password: hashedPassword,
      role: "Farmer",
      status: "Active",
      isProfileComplete: 0
    }).returning();

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed" });
  }
});

// POST logout
router.post("/logout", requireAuth, async (req, res) => {
  await writeAuditLog(req.user!.email, "Logout", getIp(req), req.user!.role);
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  return res.json({ message: "Logged out successfully" });
});

// GET me (Restore session)
router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user!.id));
    if (!user || user.status === "Inactive") {
      return res.status(401).json({ error: "User not found or inactive" });
    }
    const { password: _, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch session user" });
  }
});

// PATCH user profile (farmers)
router.patch("/users/profile/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // IDOR check: Farmers can only update their own profile
    if (req.user!.role === "Farmer" && req.user!.id !== id) {
      return res.status(403).json({ error: "Forbidden: cannot update another user's profile" });
    }

    // Validate update payload
    const updateSchema = z.object({
      aadhaar: z.string().optional(),
      landRecordId: z.string().optional(),
      plotNumber: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      taluka: z.string().optional(),
      pinCode: z.string().optional(),
      surveyNumber: z.string().optional(),
    }).strict();

    const parsedData = updateSchema.parse(req.body);

    const updateData = { 
      ...parsedData, 
      isProfileComplete: 1 
    };
    
    const updated = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id as string))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password: _, ...user } = updated[0];
    return res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Profile update error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

// GET users (Admin only) — paginated
router.get("/users", requireAuth, requireRole(["Admin", "Sub-Admin"]), async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query as Record<string, unknown>);
    const [allUsers, [{ count: total }]] = await Promise.all([
      db.select().from(users).limit(limit).offset(offset),
      db.select({ count: count() }).from(users),
    ]);
    const safeUsers = allUsers.map(({ password, ...user }) => user);
    return res.json({ data: safeUsers, pagination: { page, limit, total: Number(total) } });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST new user (Admin only)
router.post("/users", requireAuth, requireRole(["Admin", "Sub-Admin"]), async (req, res) => {
  try {
    const data = adminCreateUserSchema.parse(req.body);
    const id = `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const hashedPw = await bcrypt.hash(data.password || "default123", 10);

    const newUser = await db.insert(users).values({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPw,
      role: data.role,
      status: data.status || "Active",
    }).returning();
    const { password: _, ...safeUser } = newUser[0];
    await writeAuditLog(req.user!.email, `Created user ${safeUser.email} (${data.role})`, getIp(req), req.user!.role);
    return res.status(201).json(safeUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// PATCH user (Admin only)
router.patch("/users/:id", requireAuth, requireRole(["Admin", "Sub-Admin"]), async (req, res) => {
  try {
    const parsed = adminUpdateUserSchema.parse(req.body);
    if (parsed.password) {
      (parsed as any).password = await bcrypt.hash(parsed.password, 10);
    }

    const updated = await db.update(users)
      .set(parsed as any)
      .where(eq(users.id, req.params.id as string))
      .returning();
    
    if (!updated.length) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password: _, ...safeUser } = updated[0];
    return res.json(safeUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    return res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user (Admin only)
router.delete("/users/:id", requireAuth, requireRole(["Admin"]), async (req, res) => {
  try {
    const deleted = await db.delete(users)
      .where(eq(users.id, req.params.id as string))
      .returning();
    
    if (!deleted.length) {
      return res.status(404).json({ error: "User not found" });
    }
    await writeAuditLog(req.user!.email, `Deleted user ${req.params.id}`, getIp(req), req.user!.role);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
