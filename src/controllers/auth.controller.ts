import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import { ApiError } from "../helpers/ApiError";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);

    if (!token) {
      return next(new ApiError(401, "Credenziali non valide."));
    }

    res.json({ token });
  } catch (error) {
    console.error("Errore nel login:", error);
    next(error); // lascia che se ne occupi errorHandler
  }
};
