import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import healthRouter from "./health";
import requestsRouter from "./requests";
import usersRouter from "./users";
import logsRouter from "./logs";
import farmersRouter from "./farmers";
import uploadRouter from "./upload";
import billingRouter from "./billing";

const router: IRouter = Router();

// Rate limiter for auth endpoints — max 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for request creation — max 20 per 15 minutes per IP
const createRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(healthRouter);

// Apply rate limiter to login/signup
router.use("/login", authLimiter);
router.use("/signup", authLimiter);

router.use(usersRouter);
router.use(logsRouter);
router.use("/farmers", farmersRouter);
router.use(billingRouter);

// Apply rate limiter to new request creation
router.post("/requests", createRequestLimiter);
router.use(requestsRouter);

router.use(uploadRouter);

export default router;
