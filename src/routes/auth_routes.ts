import { RequestHandler, Router } from "express";
import { User } from "../models/user_model";
import { verifyPassword, generateToken } from "../helpers/auth_helper";

// Creo un router Express per definire le rotte
const router = Router();

// Handler per la rotta di login, con gestione asincrona
const loginHandler: RequestHandler = async (req, res): Promise<void> => {
    try {
        // Estraggo email e password dal corpo della richiesta
        const { email, password } = req.body;

        // Cerco un utente nel database con l'email fornita
        const user = await User.findOne({ where: { email } });

        // Se non trovo l'utente, rispondo con errore 401 (Unauthorized)
        if (!user) {
            res.status(401).json({ message: "Credenziali non valide." });
            return;
        }

        // Verifico se la password fornita corrisponde all'hash salvato
        const isValid = await verifyPassword(password, user.passwordHash);

        // Se la password non è valida, rispondo con errore 401
        if (!isValid) {
            res.status(401).json({ message: "Credenziali non valide." });
            return;
        }

        // Genero un token JWT con id, email e ruolo dell'utente
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // Invio il token come risposta JSON (login riuscito)
        res.json({ token });
    } catch (error) {
        // In caso di errore interno, loggo e rispondo con errore 500
        console.error(error);
        res.status(500).json({ message: "Errore durante il login." });
    }
};

// Definisco la rotta POST /api/login che utilizza loginHandler
router.post("/api/login", loginHandler);

export default router;
