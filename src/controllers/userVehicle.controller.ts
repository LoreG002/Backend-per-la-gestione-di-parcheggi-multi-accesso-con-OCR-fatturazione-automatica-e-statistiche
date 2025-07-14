import { Request, Response, NextFunction } from "express";
import * as UserVehicleService from "../services/userVehicle.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../helpers/ApiError";
import * as UserService from "../services/user.service";

export const createUserVehicle = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, plate, vehicleTypeId } = req.body;

    const targetUser = await UserService.getUserById(userId);

    if (!targetUser) {
      return next(new ApiError(404, "Utente di destinazione non trovato."));
    }

    if (targetUser.role === "operatore") {
      return next(new ApiError(403, "Non è possibile assegnare veicoli a utenti con ruolo operatore."));
    }

    const newVehicle = await UserVehicleService.createUserVehicle({ userId, plate, vehicleTypeId });
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Errore nella creazione del veicolo:", error);
    next(error);
  }
};

export const getUserVehicles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let vehicles;

    if (req.user.role === "operatore") {
      vehicles = await UserVehicleService.getAllUsersWithVehicles();
    } else {
      vehicles = await UserVehicleService.getUserVehiclesByUserId(req.user.id);
    }

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
