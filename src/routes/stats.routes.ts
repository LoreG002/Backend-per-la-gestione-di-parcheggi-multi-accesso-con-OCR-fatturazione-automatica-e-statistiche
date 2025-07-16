import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { getRevenueStats } from "../controllers/stats.controller";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per ottenere le statistiche del parcheggio tramite data di inizio e data di fine
router.get("/api/stats/fatturato", authenticateJWT, authorizeRoles("operatore"), getRevenueStats);

export default router;
