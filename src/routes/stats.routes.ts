import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRevenueStats } from "../controllers/stats.controller";

const router = Router();

router.get("/api/stats/fatturato", authenticateJWT, getRevenueStats);

export default router;
