import { Request, Response, NextFunction } from "express";
import * as VehicleTypeService from "../services/vehicleType.service";
import { ApiError } from "../helpers/ApiError";

export const getAllVehicleTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const types = await VehicleTypeService.getAllVehicleTypes();
    res.json(types);
  } catch (error) {
    console.error("Errore nel recupero tipi di veicolo:", error);
    next(error);
  }
};

export const updateVehicleType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const type = await VehicleTypeService.updateVehicleType(Number(req.params.id), req.body);
    if (!type) {
      return next(new ApiError(404, "Tipo di veicolo non trovato."));
    }
    res.json(type);
  } catch (error) {
    console.error("Errore nell'aggiornamento tipo di veicolo:", error);
    next(error);
  }
};

export const deleteVehicleType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await VehicleTypeService.deleteVehicleType(Number(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Tipo di veicolo non trovato."));
    }
    res.json({ message: "Tipo di veicolo eliminato con successo." });
  } catch (error) {
    console.error("Errore nella cancellazione tipo di veicolo:", error);
    next(error);
  }
};
