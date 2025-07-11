import { Request, Response } from "express";
import * as UserVehicleService from "../services/userVehicle.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createUserVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, plate, vehicleTypeId } = req.body;
    const newVehicle = await UserVehicleService.createUserVehicle({ userId, plate, vehicleTypeId });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Errore nella creazione del veicolo:", error);
    res.status(500).json({ message: "Errore nella creazione del veicolo." });
  }
};

export const getUserVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const vehicles = await UserVehicleService.getUserVehiclesByUserId(userId);
    res.json(vehicles);
  } catch (error) {
    console.error("Errore nel recupero dei veicoli:", error);
    res.status(500).json({ message: "Errore nel recupero dei veicoli." });
  }
};

export const deleteUserVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await UserVehicleService.deleteUserVehicle(parseInt(req.params.id));
    if (!success) {
      res.status(404).json({ message: "Veicolo non trovato." });
      return;
    }
    res.json({ message: "Veicolo eliminato con successo." });
  } catch (error) {
    console.error("Errore nella eliminazione del veicolo:", error);
    res.status(500).json({ message: "Errore nella eliminazione del veicolo." });
  }
};
