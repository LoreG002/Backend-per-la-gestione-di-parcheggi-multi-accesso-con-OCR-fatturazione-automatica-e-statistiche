import { Router } from "express";
import * as UserVehicleController from "../controllers/userVehicle.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per associare un veicolo a un utente
router.post("/api/user-vehicles", authenticateJWT, authorizeRoles("operatore"), UserVehicleController.createUserVehicle);

// Rotta per ottenere i veicoli associati all’utente autenticato
router.get("/api/user-vehicles", authenticateJWT, UserVehicleController.getUserVehicles);

// Rotta per eliminare l'associazione di un veicolo a un utente
router.delete("/api/user-vehicles/:id", authenticateJWT, authorizeRoles("operatore"), UserVehicleController.deleteUserVehicle);

export default router;
