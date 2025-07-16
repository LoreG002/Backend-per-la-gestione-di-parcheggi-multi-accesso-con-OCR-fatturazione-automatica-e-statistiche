import { Router } from "express";
import * as VehicleTypeController from "../controllers/vehicleType.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per ottenere tutti i tipi di veicolo
router.get("/api/vehicle-types", authenticateJWT, VehicleTypeController.getAllVehicleTypes);

// Rotta per aggiornare un tipo di veicolo
router.put("/api/vehicle-types/:id", authenticateJWT, authorizeRoles("operatore"), VehicleTypeController.updateVehicleType);

// Rotta per eliminare un tipo di veicolo
router.delete("/api/vehicle-types/:id", authenticateJWT, authorizeRoles("operatore"), VehicleTypeController.deleteVehicleType);

export default router;
