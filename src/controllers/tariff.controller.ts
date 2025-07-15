import { Request, Response, NextFunction } from "express";
import * as TariffService from "../services/tariff.service";
import { ApiError } from "../helpers/ApiError";

// Restituisce tutte le tariffe presenti nel sistema
export const getAllTariffs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tariffs = await TariffService.getAllTariffs();
    res.json(tariffs);
  } catch (error) {
    console.error("Errore nel restituire tutte le tariffe:", error);
    next(error);
  }
};

// Crea una nuova tariffa associata a parcheggio, tipo veicolo, fascia oraria e giorno
export const createTariff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { parkingId, vehicleTypeId, startHour, endHour, dayType, pricePerHour } = req.body;

    const tariff = await TariffService.createTariff({
      parkingId,
      vehicleTypeId,
      startHour,
      endHour,
      dayType,
      pricePerHour,
    });

    res.status(201).json(tariff);
  } catch (error) {
    console.error("Errore nel creare la tariffa:", error);
    next(error);
  }
};

// Aggiorna una tariffa esistente tramite ID
export const updateTariff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updated = await TariffService.updateTariff(id, req.body);

    if (!updated) {
      return next(new ApiError(404, "Tariffa non trovata."));
    }

    res.json(updated);
  } catch (error) {
    console.error("Errore nel modificare la tariffa:", error);
    next(error);
  }
};

// Elimina una tariffa tramite ID
export const deleteTariff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const success = await TariffService.deleteTariff(id);

    if (!success) {
      return next(new ApiError(404, "Tariffa non trovata."));
    }

    res.json({ message: "Tariffa eliminata con successo." });
  } catch (error) {
    console.error("Errore nell'eliminare la tariffa:", error);
    next(error);
  }
};

