import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/auth.helper";

// Estensione dell'interfaccia Request per includere l'oggetto utente
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware di autenticazione JWT
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // Verifica la presenza dell'header Authorization
  if (!authHeader) {
    res.status(401).json({ message: "Token mancante" });
    return;
  }

  // Estrae il token dalla stringa "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Verifica e decodifica il token, assegnando i dati all'oggetto req.user
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Token non valido" });
  }
};
