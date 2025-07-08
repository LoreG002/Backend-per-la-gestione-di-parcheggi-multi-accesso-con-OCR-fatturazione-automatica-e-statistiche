import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Accesso negato. Ruolo non autorizzato." });
      return;
    }

    next();
  };
};
