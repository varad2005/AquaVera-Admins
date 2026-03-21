import { defineConfig } from "drizzle-kit";
import path from "path";
import dotenv from "dotenv";

// Load .env from workspace root
// We assume this is run from the lib/db directory
const envPath = path.resolve(process.cwd(), "../../.env");
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("[PASSWORD]")) {
  throw new Error("DATABASE_URL must be set and configured in " + envPath);
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
