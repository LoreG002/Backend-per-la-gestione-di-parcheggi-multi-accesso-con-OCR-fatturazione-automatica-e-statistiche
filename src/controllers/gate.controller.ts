import { Request, Response } from "express";
import * as GateService from "../services/gate.service";

export const updateGate = async (req: Request, res: Response): Promise<void> => {
  try {
    const gate = await GateService.updateGate(Number(req.params.id), req.body);
    if (!gate) {
      res.status(404).json({ message: "Varco non trovato." });
      return;
    }
    res.json(gate);
  } catch (error) {
    console.error("Errore nell'aggiornamento del varco:", error);
    res.status(500).json({ message: "Errore interno." });
  }
};

export const deleteGate = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await GateService.deleteGate(Number(req.params.id));
    if (!success) {
      res.status(404).json({ message: "Varco non trovato." });
      return;
    }
    res.json({ message: "Varco eliminato con successo." });
  } catch (error) {
    console.error("Errore nell'eliminazione del varco:", error);
    res.status(500).json({ message: "Errore interno." });
  }
};
