import { Router } from "express";
import * as ParkingController from "../controllers/parking.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post("/api/parkings", authenticateJWT, authorizeRoles("operatore"), ParkingController.createParking);
router.put("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), ParkingController.updateParking);
router.delete("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), ParkingController.deleteParking);
router.get("/api/parkings/:id/available", authenticateJWT, ParkingController.checkAvailability);

export default router;
