import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiError } from "../helpers/ApiError";

// Middleware per autorizzare l'accesso in base ai ruoli specificati
export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;

    // Verifica che l'utente esista e che il suo ruolo sia tra quelli autorizzati
    if (!user || !allowedRoles.includes(user.role)) {
      const isOperatorAccessingInvoiceStatus =
        user?.role === "operatore" && req.originalUrl.includes("/api/invoices/status");

      const message = isOperatorAccessingInvoiceStatus
        ? "Gli operatori non possono accedere a questa rotta. Per visualizzare lo stato delle fatture, usa GET /api/invoices."
        : "Accesso negato. Ruolo non autorizzato.";

      return next(new ApiError(403, message));
    }

    next(); // Utente autorizzato, si prosegue con la richiesta
  };
};
