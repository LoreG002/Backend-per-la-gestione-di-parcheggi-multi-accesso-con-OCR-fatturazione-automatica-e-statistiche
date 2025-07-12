import { Request, Response } from "express";
import * as TariffService from "../services/tariff.service";

export const getAllTariffs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tariffs = await TariffService.getAllTariffs();
    res.json(tariffs);
  } catch (error) {
    console.error("Errore getAllTariffs:", error);
    res.status(500).json({ message: "Errore nel recupero delle tariffe." });
  }
};

export const createTariff = async (req: Request, res: Response): Promise<void> => {
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
    console.error("Errore createTariff:", error);
    res.status(500).json({ message: "Errore nella creazione della tariffa." });
  }
};

export const updateTariff = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const updated = await TariffService.updateTariff(id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Tariffa non trovata." });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Errore updateTariff:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento della tariffa." });
  }
};

export const deleteTariff = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const success = await TariffService.deleteTariff(id);
    if (!success) {
      res.status(404).json({ message: "Tariffa non trovata." });
      return;
    }
    res.json({ message: "Tariffa eliminata con successo." });
  } catch (error) {
    console.error("Errore deleteTariff:", error);
    res.status(500).json({ message: "Errore nell'eliminazione della tariffa." });
  }
};
