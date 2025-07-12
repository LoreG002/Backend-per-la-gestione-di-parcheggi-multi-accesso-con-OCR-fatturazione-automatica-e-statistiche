import { Router } from "express";
import * as VehicleTypeController from "../controllers/vehicleType.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/api/vehicle-types", VehicleTypeController.getAllVehicleTypes);
router.put("/api/vehicle-types/:id", authenticateJWT, authorizeRoles("operatore"), VehicleTypeController.updateVehicleType);
router.delete("/api/vehicle-types/:id", authenticateJWT, authorizeRoles("operatore"), VehicleTypeController.deleteVehicleType);

export default router;
