import { Request, Response, NextFunction } from "express";

export function validateTransitDates(req: Request, res: Response, next: NextFunction): void {
  const { data_ingresso, data_uscita } = req.body;

  if (data_ingresso && data_uscita) {
    const ingresso = new Date(data_ingresso);
    const uscita = new Date(data_uscita);

    if (isNaN(ingresso.getTime()) || isNaN(uscita.getTime())) {
      res.status(400).json({ error: "Formato data non valido." });
      return;
    }

    if (uscita < ingresso) {
      res.status(400).json({ error: "La data di uscita non può essere precedente a quella di ingresso." });
      return;
    }
  }

  next();
}
