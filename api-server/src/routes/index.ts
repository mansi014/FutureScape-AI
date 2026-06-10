import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scenariosRouter from "./scenarios";
import compareRouter from "./compare";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scenariosRouter);
router.use(compareRouter);
router.use(statsRouter);

export default router;
