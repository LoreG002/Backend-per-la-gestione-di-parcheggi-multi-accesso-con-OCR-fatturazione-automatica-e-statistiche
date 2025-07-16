import { Tariff, TariffAttributes } from "../models/tariff.model";

// Restituisce tutte le tariffe presenti nel database
export const getAllTariffs = async () => {
  return await Tariff.findAll();
};

// Crea una nuova tariffa (escludendo l'id che viene generato automaticamente)
export const createTariff = async (data: Omit<TariffAttributes, "id">) => {
  return await Tariff.create(data);
};

// Aggiorna una tariffa esistente se trovata, altrimenti restituisce null
export const updateTariff = async (id: number, updates: Partial<TariffAttributes>) => {
  const tariff = await Tariff.findByPk(id);
  if (!tariff) return null;
  return await tariff.update(updates);
};

// Elimina una tariffa se esistente, altrimenti restituisce null
export const deleteTariff = async (id: number) => {
  const tariff = await Tariff.findByPk(id);
  if (!tariff) return null;
  await tariff.destroy();
  return true;
};

