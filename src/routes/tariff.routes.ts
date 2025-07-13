import { Router } from "express";
import * as TariffController from "../controllers/tariff.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/api/tariffs", authenticateJWT, TariffController.getAllTariffs);

router.post(
  "/api/tariffs",
  authenticateJWT,
  authorizeRoles("operatore"),
  TariffController.createTariff
);

router.put(
  "/api/tariffs/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  TariffController.updateTariff
);

router.delete(
  "/api/tariffs/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  TariffController.deleteTariff
);

export default router;
