import { Router } from "express";
import * as GateController from "../controllers/gate.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.put("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.updateGate);
router.delete("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), GateController.deleteGate);

export default router;
