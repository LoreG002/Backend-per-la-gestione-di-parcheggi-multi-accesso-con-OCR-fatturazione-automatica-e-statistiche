import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

// Middleware per autorizzare l'accesso in base ai ruoli specificati
export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    // Verifica che l'utente esista e che il suo ruolo sia tra quelli autorizzati
    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Accesso negato. Ruolo non autorizzato." });
      return;
    }

    next(); // Utente autorizzato, si prosegue con la richiesta
  };
};
