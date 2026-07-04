import { Router, type IRouter } from "express";
import healthRouter from "./health";
import areasRouter from "./areas";
import quizRouter from "./quiz";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use(areasRouter);
router.use(quizRouter);
router.use(eventsRouter);

export default router;
