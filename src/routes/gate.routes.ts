import { Router } from "express";
import * as GateController from "../controllers/gate.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/api/gates", authenticateJWT, GateController.getAllGates);
router.get("/api/gates/:id", authenticateJWT, GateController.getGateById);
router.post("/api/gates", authenticateJWT, authorizeRoles("operatore"), GateController.createGate);
router.put("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.updateGate);
router.delete("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.deleteGate);

export default router;
