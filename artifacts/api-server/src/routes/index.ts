import { Router, type IRouter } from "express";
import healthRouter from "./health";
import areasRouter from "./areas";
import quizRouter from "./quiz";
import eventsRouter from "./events";
import freeGroupRouter from "./free-group";
import opportunityGroupRouter from "./opportunity-group";

const router: IRouter = Router();

router.use(healthRouter);
router.use(areasRouter);
router.use(quizRouter);
router.use(eventsRouter);
router.use(freeGroupRouter);
router.use(opportunityGroupRouter);

export default router;
