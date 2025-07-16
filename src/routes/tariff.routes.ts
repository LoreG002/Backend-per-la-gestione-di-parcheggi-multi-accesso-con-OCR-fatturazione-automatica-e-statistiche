import { Router } from "express";
import * as TariffController from "../controllers/tariff.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per ottenere tutte le tariffe
router.get("/api/tariffs", authenticateJWT, TariffController.getAllTariffs);

// Rotta per creare una nuova tariffa
router.post("/api/tariffs", authenticateJWT, authorizeRoles("operatore"), TariffController.createTariff);

// Rotta per aggiornare una tariffa esistente tramite ID
router.put("/api/tariffs/:id", authenticateJWT, authorizeRoles("operatore"), TariffController.updateTariff);

// Rotta per eliminare una tariffa tramite ID
router.delete("/api/tariffs/:id", authenticateJWT, authorizeRoles("operatore"), TariffController.deleteTariff);

export default router;
