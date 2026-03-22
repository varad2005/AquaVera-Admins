import path from "path";
import dotenv from "dotenv";

// Load .env from workspace root BEFORE any other imports, but only in development
if (process.env.NODE_ENV !== "production") {
  const envPath = path.resolve(process.cwd(), ".env");
  dotenv.config({ path: envPath });
}

// Pre-import check for required env vars to avoid silent crashes during dependency resolution
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set in the production environment!");
  process.exit(1);
}

import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env["PORT"]) || 3000;

try {
  logger.info({ port }, "Attempting to start server...");
  const server = app.listen(port, () => {
    logger.info({ port }, "Server listening successfully");
  });

  server.on("error", (err) => {
    logger.error({ err }, "Server error occurred");
    process.exit(1);
  });
} catch (err) {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
}
