import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);

    if (!token) {
      res.status(401).json({ message: "Credenziali non valide." });
      return;
    }

    res.json({ token });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore durante il login." });
  }
};
