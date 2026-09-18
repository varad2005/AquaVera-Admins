import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { db, users } from "../lib/db/src/index.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
  const hashed = await bcrypt.hash("password123", 10);
  
  await db.update(users).set({ password: hashed }).where(eq(users.email, "admin@aquavera.com"));
  await db.update(users).set({ password: hashed }).where(eq(users.email, "north@aquavera.com"));
  await db.update(users).set({ password: hashed }).where(eq(users.email, "vinayak@farmer.com"));
  
  console.log("Passwords updated to 'password123'");

  const login = async (email: string, role: string) => {
    const res = await fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "password123" })
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Login successful for ${role} (${email}) - Received role: ${data.role}`);
    } else {
      console.log(`❌ Login failed for ${role} (${email}) - Status: ${res.status}`);
      console.log(await res.text());
    }
  };

  await login("admin@aquavera.com", "Admin");
  await login("north@aquavera.com", "Sub-Admin");
  await login("vinayak@farmer.com", "Farmer");

  process.exit(0);
}

main().catch(console.error);
