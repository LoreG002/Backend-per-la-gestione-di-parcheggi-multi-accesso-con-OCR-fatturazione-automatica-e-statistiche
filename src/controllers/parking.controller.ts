import { Request, Response, NextFunction } from "express";
import * as ParkingService from "../services/parking.service";
import { checkParkingAvailability } from "../helpers/parking.helper";
import { ApiError } from "../helpers/ApiError";

// Crea un nuovo parcheggio con i dati forniti nel body
export const createParking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parking = await ParkingService.createParking(req.body);
    res.status(201).json(parking);
  } catch (error) {
    console.error("Errore nella creazione:", error);
    next(error);
  }
};

// Aggiorna un parcheggio esistente tramite ID
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

// Elimina un parcheggio tramite ID
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

// Verifica se ci sono posti disponibili associati a un varco
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
