import path from "path";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS: Allow same-origin and dev Vite proxy; in production use explicit origin
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? allowedOrigin : true,
    credentials: true, // Required to allow cookies to be sent with requests
  }),
);

// Cookie parser MUST be registered before any route that reads req.cookies
app.use(cookieParser());

// Body limits prevent oversized payloads (e.g. base64 image attacks)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", router);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const publicPath = path.resolve(process.cwd(), "artifacts/api-server/dist/public");
  
  if (express.static(publicPath)) {
    app.use(express.static(publicPath));
  }

  // Catch-all for SPA routing
  app.get("*path", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

export default app;
