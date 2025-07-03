import { RequestHandler, Router } from "express";
import { User } from "../models/user_model";
import { verifyPassword, generateToken } from "../helpers/auth_helper";

const router = Router();

const loginHandler: RequestHandler = async (req, res): Promise <void>=> {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
        res.status(401).json({ message: "Credenziali non valide." });
        return;
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
        res.status(401).json({ message: "Credenziali non valide." });
        return;
        }

        const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore durante il login." });
    }
};

router.post("/api/login", loginHandler); //si aspetta una firma esatta e quindi devo passargli il request handler
  
export default router;