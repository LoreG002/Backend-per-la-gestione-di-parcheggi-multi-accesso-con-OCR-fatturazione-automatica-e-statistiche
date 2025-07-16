import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRevenueStats } from "../controllers/stats.controller";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateDates } from "../middlewares/validateDates.middleware";

const router = Router();

router.get("/api/stats/fatturato", authenticateJWT, authorizeRoles("operatore"),  validateDates({ fields: ["startDate", "endDate"], source: "query" }), getRevenueStats);

export default router;
