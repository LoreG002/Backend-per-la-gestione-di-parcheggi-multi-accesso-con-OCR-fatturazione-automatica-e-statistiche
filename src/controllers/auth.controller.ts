import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import { ApiError } from "../helpers/ApiError";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Autenticazione utente tramite AuthService
    const token = await AuthService.login(email, password);

    // Se le credenziali sono errate, genera un errore 401
    if (!token) {
      return next(new ApiError(401, "Credenziali non valide."));
    }

    // Risposta con token JWT in caso di successo
    res.json({ token });

  } catch (error) {
    console.error("Errore nel login:", error);
    next(error); // Delego la gestione al middleware centralizzato
  }
};
