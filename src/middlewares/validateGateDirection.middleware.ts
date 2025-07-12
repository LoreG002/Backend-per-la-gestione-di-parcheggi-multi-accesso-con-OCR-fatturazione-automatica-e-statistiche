import { Response, NextFunction } from "express";
import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { AuthRequest } from "./auth.middleware";

export const validateGateDirection = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gateId = parseInt(req.body.gateId);
    const plate = req.body.plate?.toUpperCase();

    if (!gateId || !plate) {
      res.status(400).json({ error: "gateId e plate sono obbligatori." });
      return;
    }

    const gate = await Gate.findByPk(gateId);
    if (!gate) {
      res.status(404).json({ error: "Gate non trovato." });
      return;
    }

    // Cerca gli ultimi transiti per quella targa, ordinati dal più recente
    const lastTransit = await Transit.findOne({
      where: { plate },
      order: [["timestamp", "DESC"]],
    });

    const lastDirection = lastTransit?.direction;

    switch (gate.direction) {
    case "entrata":
      if (lastDirection === "entrata") {
        res.status(400).json({ error: "Il veicolo è già entrato e non è ancora uscito." });
        return;
      }
      break;

    case "uscita":
      if (lastDirection !== "entrata") {
        res.status(400).json({ error: "Il veicolo non può uscire senza prima essere entrato." });
        return;
      }
      break;

    case "bidirezionale":
      if (lastDirection === "entrata") {
      // Richiediamo che l'uscita venga registrata, non nuova entrata
        req.body.direction = "uscita";
      } else {
        req.body.direction = "entrata";
      }
      break;

    default:
      res.status(400).json({ error: "Direzione del gate non valida." });
      return;
    }

    next();
  } catch (error) {
    console.error("Errore nella validazione direzione gate:", error);
    res.status(500).json({ error: "Errore interno nel controllo della logica gate." });
  }
};
