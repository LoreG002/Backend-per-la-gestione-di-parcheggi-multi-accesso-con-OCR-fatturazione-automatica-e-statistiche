import { Request, Response, NextFunction } from "express";
import * as GateService from "../services/gate.service";
import { ApiError } from "../helpers/ApiError";

export const updateGate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gate = await GateService.updateGate(Number(req.params.id), req.body);
    if (!gate) {
      return next(new ApiError(404, "Varco non trovato."));
    }
    res.json(gate);
  } catch (error) {
    console.error("Errore nell'aggiornamento del varco:", error);
    next(error);
  }
};

export const deleteGate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await GateService.deleteGate(Number(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Varco non trovato."));
    }
    res.json({ message: "Varco eliminato con successo." });
  } catch (error) {
    console.error("Errore nell'eliminazione del varco:", error);
    next(error);
  }
};
