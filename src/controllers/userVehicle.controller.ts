import { Request, Response, NextFunction } from "express";
import * as UserVehicleService from "../services/userVehicle.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../helpers/ApiError";

export const createUserVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, plate, vehicleTypeId } = req.body;
    const newVehicle = await UserVehicleService.createUserVehicle({ userId, plate, vehicleTypeId });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Errore nella creazione del veicolo:", error);
    next(error);
  }
};

export const getUserVehicles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.id;
    const vehicles = await UserVehicleService.getUserVehiclesByUserId(userId);
    res.json(vehicles);
  } catch (error) {
    console.error("Errore nel recupero dei veicoli:", error);
    next(error);
  }
};

export const deleteUserVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await UserVehicleService.deleteUserVehicle(parseInt(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Veicolo non trovato."));
    }
    res.json({ message: "Veicolo eliminato con successo." });
  } catch (error) {
    console.error("Errore nella eliminazione del veicolo:", error);
    next(error);
  }
};
