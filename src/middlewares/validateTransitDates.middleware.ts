import { Request, Response, NextFunction } from "express";

// Middleware per validare la coerenza delle date di ingresso e uscita di un transito
export function validateTransitDates(req: Request, res: Response, next: NextFunction): void {
  const { data_ingresso, data_uscita } = req.body;

  // Se entrambe le date sono presenti, effettua i controlli
  if (data_ingresso && data_uscita) {
    const ingresso = new Date(data_ingresso);
    const uscita = new Date(data_uscita);

    // Verifica che entrambe le date siano valide
    if (isNaN(ingresso.getTime()) || isNaN(uscita.getTime())) {
      res.status(400).json({ error: "Formato data non valido." });
      return;
    }

    // Verifica che la data di uscita non sia antecedente a quella di ingresso
    if (uscita < ingresso) {
      res.status(400).json({ error: "La data di uscita non può essere precedente a quella di ingresso." });
      return;
    }
  }

  next(); // Se tutto è valido , passa al middleware successivo
}

