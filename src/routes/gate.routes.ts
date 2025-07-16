import { Router } from "express";
import * as GateController from "../controllers/gate.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per ottenere tutti i varchi
router.get("/api/gates", authenticateJWT, GateController.getAllGates);

// Rotta per ottenere un singolo varco tramite ID
router.get("/api/gates/:id", authorizeRoles("operatore"), authenticateJWT, GateController.getGateById);

// Rotta per creare un nuovo varco
router.post("/api/gates", authenticateJWT, authorizeRoles("operatore"), GateController.createGate);

// Rotta per aggiornare un varco esistente tramite ID
router.put("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.updateGate);

// Rotta per eliminare un varco tramite ID
router.delete("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.deleteGate);

export default router;
