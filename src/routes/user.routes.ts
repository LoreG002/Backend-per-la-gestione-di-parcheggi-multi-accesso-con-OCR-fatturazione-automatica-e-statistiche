import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Rotta per ottenere tutti gli utenti o i propri dati per l'utente con ruolo "utente"
router.get("/api/users", authenticateJWT, UserController.getAllUsers);

// Rotta per ottenere un singolo utente tramite ID
router.get("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), UserController.getUserById);

// Rotta per creare un nuovo utente 
router.post("/api/users", authenticateJWT, authorizeRoles("operatore"), UserController.createUser);

// Rotta per ricaricare il credito di un utente tramite ID
router.put("/api/users/:id/credit", authenticateJWT, authorizeRoles("operatore"), UserController.rechargeUserCredit);

// Rotta per eliminare un utente tramite ID
router.delete("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), UserController.deleteUser);

export default router;
