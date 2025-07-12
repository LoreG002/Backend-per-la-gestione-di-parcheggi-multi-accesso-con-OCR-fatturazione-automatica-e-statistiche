import { Request, Response } from "express";
import * as VehicleTypeService from "../services/vehicleType.service";

export const getAllVehicleTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const types = await VehicleTypeService.getAllVehicleTypes();
    res.json(types);
  } catch (error) {
    console.error("Errore nel recupero tipi di veicolo:", error);
    res.status(500).json({ message: "Errore interno." });
  }
};

export const updateVehicleType = async (req: Request, res: Response): Promise<void> => {
  try {
    const type = await VehicleTypeService.updateVehicleType(Number(req.params.id), req.body);
    if (!type) {
      res.status(404).json({ message: "Tipo di veicolo non trovato." });
      return;
    }
    res.json(type);
  } catch (error) {
    console.error("Errore nell'aggiornamento tipo di veicolo:", error);
    res.status(500).json({ message: "Errore interno." });
  }
};

export const deleteVehicleType = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await VehicleTypeService.deleteVehicleType(Number(req.params.id));
    if (!success) {
      res.status(404).json({ message: "Tipo di veicolo non trovato." });
      return;
    }
    res.json({ message: "Tipo di veicolo eliminato con successo." });
  } catch (error) {
    console.error("Errore nella cancellazione tipo di veicolo:", error);
    res.status(500).json({ message: "Errore interno." });
  }
};
