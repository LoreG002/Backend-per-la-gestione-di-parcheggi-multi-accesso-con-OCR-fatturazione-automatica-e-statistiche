import { Router } from "express";
import * as TransitController from "../controllers/transit.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import multer from "multer";
import { validateTransitDates } from "../middlewares/validateTransitDates.middleware";

const router = Router();

// Configurazione storage per il salvataggio delle immagini caricate
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Istanza di multer con la configurazione definita sopra
const upload = multer({ storage });

// Rotta per creare un transito in automatico, da immagine (OCR) se il gate è standard e dal json se il gate è smart
router.post("/api/transits/auto", authenticateJWT, authorizeRoles("operatore"), upload.single("image"), validateTransitDates, TransitController.createTransitAuto);

// Rotta per ottenere tutti i transiti visibili
router.get("/api/transits", authenticateJWT, TransitController.getAllTransits);

// Rotta per cercare i transiti filtrando per parametri
router.post("/api/transits/search", authenticateJWT, TransitController.searchTransits);

// Rotta per aggiornare un transito esistente tramite ID
router.put("/api/transits/:id", authenticateJWT, authorizeRoles("operatore"), validateTransitDates, TransitController.updateTransit);

// Rotta per eliminare un transito tramite ID
router.delete("/api/transits/:id", authenticateJWT, authorizeRoles("operatore"), TransitController.deleteTransit);

export default router;
