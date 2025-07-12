import { Router } from "express";
import * as TransitController from "../controllers/transit.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/api/transits/auto", authenticateJWT, authorizeRoles("operatore"), upload.single("image"), TransitController.createTransitAuto);
router.get("/api/transits", authenticateJWT, TransitController.getAllTransits);
router.post("/api/transits/search", authenticateJWT, TransitController.searchTransits);
router.put("/api/transits/:id", authorizeRoles("operatore"), TransitController.updateTransit);
router.delete("/api/transits/:id", authorizeRoles("operatore"), TransitController.deleteTransit);

export default router;
