import * as TariffDAO from "../dao/tariff.dao";
import { TariffAttributes } from "../models/tariff.model";

// Esporta la funzione per ottenere tutte le tariffe
export const getAllTariffs = TariffDAO.getAllTariffs;

// Crea una nuova tariffa
export const createTariff = async (data: Omit<TariffAttributes, "id">) => {
  return await TariffDAO.createTariff(data);
};

// Aggiorna una tariffa esistente in base all'ID e ai campi forniti
export const updateTariff = async (id: number, data: Partial<TariffAttributes>) => {
  return await TariffDAO.updateTariff(id, data);
};

// Elimina una tariffa tramite il suo ID
export const deleteTariff = async (id: number) => {
  return await TariffDAO.deleteTariff(id);
};
