import { Router } from "express";
import * as TransitController from "../controllers/transit.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import multer from "multer";
import { validateDates } from "../middlewares/validateDates.middleware";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 👇 Post con OCR immagine
router.post(
  "/api/transits/auto",
  authenticateJWT,
  authorizeRoles("operatore"),
  upload.single("image"),
  validateDates({ fields: ["data_ingresso", "data_uscita"], source: "body" }),
  TransitController.createTransitAuto
);

// 👇 Lista transiti (utente o operatore)
router.get(
  "/api/transits",
  authenticateJWT,
  TransitController.getAllTransits
);

// 👇 Ricerca con filtri (es. date) — valida date
router.post(
  "/api/transits/search",
  authenticateJWT,
  validateDates({ fields: ["start", "end"], source: "body" }),
  TransitController.searchTransits
);

// 👇 Modifica transito — valida date e richiede ruolo operatore
router.put(
  "/api/transits/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  validateDates({ fields: ["data_ingresso", "data_uscita"], source: "body" }),
  TransitController.updateTransit
);

// 👇 Eliminazione transito
router.delete(
  "/api/transits/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  TransitController.deleteTransit
);

export default router;
