import { Router, type IRouter } from "express";
import healthRouter from "./health";
import requestsRouter from "./requests";
import usersRouter from "./users";
import logsRouter from "./logs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requestsRouter);
router.use(usersRouter);
router.use(logsRouter);


export default router;
