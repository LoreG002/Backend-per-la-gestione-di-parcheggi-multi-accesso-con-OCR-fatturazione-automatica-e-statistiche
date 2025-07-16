import { Router } from "express";
import * as ParkingController from "../controllers/parking.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per creare un nuovo parcheggio
router.post("/api/parkings", authenticateJWT, authorizeRoles("operatore"), ParkingController.createParking);

// Rotta per modificare un parcheggio esistente tramite il suo ID
router.put("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), ParkingController.updateParking);

// Rotta per eliminare un parcheggio tramite il suo ID
router.delete("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), ParkingController.deleteParking);

// Rotta per verificare la disponibilità di un parcheggio specifico
router.get("/api/parkings/:id/available", authenticateJWT, ParkingController.checkAvailability);

export default router;
