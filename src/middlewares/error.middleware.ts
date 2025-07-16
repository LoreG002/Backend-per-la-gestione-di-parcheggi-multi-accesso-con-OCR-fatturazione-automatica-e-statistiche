import { Request, Response, NextFunction } from "express";

// Middleware centrale per la gestione degli errori
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Imposta lo status code dell'errore, default a 500 (Internal Server Error)
  const status = err.status || 500;
  const message = err.message || "Errore interno del server";

  // Restituisce una risposta JSON strutturata contenente l'errore
  res.status(status).json({
    success: false,
    error: {
      status,
      message,
    },
  });
};

