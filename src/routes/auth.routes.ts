import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/api/login", AuthController.login);

export default router;
