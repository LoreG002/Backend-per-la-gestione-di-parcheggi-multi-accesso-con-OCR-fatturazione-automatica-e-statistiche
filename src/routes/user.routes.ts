import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/api/users", authenticateJWT, UserController.getAllUsers);
router.get("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), UserController.getUserById);
router.post("/api/users", authenticateJWT, authorizeRoles("operatore"), UserController.createUser);
router.put("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), UserController.updateUser);
router.delete("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), UserController.deleteUser);

export default router;
