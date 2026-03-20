import path from "path";
import dotenv from "dotenv";

// Load .env from workspace root BEFORE any other imports
dotenv.config({ path: path.resolve(import.meta.dirname, "../../../.env") });

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
