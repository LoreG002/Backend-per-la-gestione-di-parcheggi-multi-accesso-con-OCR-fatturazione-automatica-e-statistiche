import { Request, Response, NextFunction } from "express";
import * as ParkingService from "../services/parking.service";
import { checkParkingAvailability } from "../helpers/parking.helper";
import { ApiError } from "../helpers/ApiError";

export const createParking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parking = await ParkingService.createParking(req.body);
    res.status(201).json(parking);
  } catch (error) {
    console.error("Errore nella creazione:", error);
    next(error);
  }
};

export const updateParking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parking = await ParkingService.updateParking(Number(req.params.id), req.body);
    if (!parking) {
      return next(new ApiError(404, "Parcheggio non trovato."));
    }
    res.json(parking);
  } catch (error) {
    console.error("Errore nell'update:", error);
    next(error);
  }
};

export const deleteParking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await ParkingService.deleteParking(Number(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Parcheggio non trovato."));
    }
    res.json({ message: "Parcheggio eliminato con successo." });
  } catch (error) {
    console.error("Errore nella cancellazione:", error);
    next(error);
  }
};

export const checkAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gateId = Number(req.params.id);
    const isAvailable = await checkParkingAvailability(gateId);
    res.json({ available: isAvailable });
  } catch (error) {
    console.error("Errore nella verifica disponibilità:", error);
    next(error);
  }
};
