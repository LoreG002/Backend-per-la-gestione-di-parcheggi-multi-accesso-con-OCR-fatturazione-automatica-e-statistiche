import { Request, Response } from "express";
import * as ParkingService from "../services/parking.service";
import { checkParkingAvailability } from "../helpers/parking.helper";

export const createParking = async (req: Request, res: Response): Promise<void> => {
  try {
    const parking = await ParkingService.createParking(req.body);
    res.status(201).json(parking);
  } catch (error) {
    console.error("Errore nella creazione:", error);
    res.status(500).json({ message: "Errore nella creazione del parcheggio" });
  }
};

export const updateParking = async (req: Request, res: Response): Promise<void> => {
  try {
    const parking = await ParkingService.updateParking(Number(req.params.id), req.body);
    if (!parking) {
      res.status(404).json({ message: "Parcheggio non trovato." });
      return;
    }
    res.json(parking);
  } catch (error) {
    console.error("Errore nell'update:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento del parcheggio" });
  }
};

export const deleteParking = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await ParkingService.deleteParking(Number(req.params.id));
    if (!success) {
      res.status(404).json({ message: "Parcheggio non trovato." });
      return;
    }
    res.json({ message: "Parcheggio eliminato con successo." });
  } catch (error) {
    console.error("Errore nella cancellazione:", error);
    res.status(500).json({ message: "Errore nella cancellazione del parcheggio" });
  }
};

export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const gateId = Number(req.params.id);
    const isAvailable = await checkParkingAvailability(gateId);
    res.json({ available: isAvailable });
  } catch (error) {
    console.error("Errore nella verifica disponibilità:", error);
    res.status(500).json({ message: "Errore nel controllo della disponibilità del parcheggio." });
  }
}