import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

// Rotta per effettuare il login e ottenere il JWT
router.post("/api/login", AuthController.login);

export default router;
