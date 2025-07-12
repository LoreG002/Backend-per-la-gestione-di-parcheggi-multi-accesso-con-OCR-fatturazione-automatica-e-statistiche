import { Router } from "express";
import * as UserVehicleController from "../controllers/userVehicle.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post(
  "/api/user-vehicles",
  authenticateJWT,
  authorizeRoles("operatore"),
  UserVehicleController.createUserVehicle
);

router.get(
  "/api/user-vehicles",
  authenticateJWT,
  UserVehicleController.getUserVehicles
);

router.delete(
  "/api/user-vehicles/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  UserVehicleController.deleteUserVehicle
);

export default router;
