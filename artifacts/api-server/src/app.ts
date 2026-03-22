import path from "path";
import express, { type Express } from "express";
import cors from "cors";
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
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api", router);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  // In unified deployment, we are run from the root, and assets 
  // are in artifacts/api-server/dist/public
  const publicPath = path.resolve(process.cwd(), "artifacts/api-server/dist/public");
  
  if (express.static(publicPath)) {
    app.use(express.static(publicPath));
  }

  // Catch-all for SPA routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

export default app;
