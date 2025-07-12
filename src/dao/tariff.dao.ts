import { Tariff, TariffAttributes } from "../models/tariff.model";

export const getAllTariffs = async () => {
  return await Tariff.findAll();
};

export const createTariff = async (data: Omit<TariffAttributes, "id">) => {
  return await Tariff.create(data);
};

export const updateTariff = async (id: number, updates: Partial<TariffAttributes>) => {
  const tariff = await Tariff.findByPk(id);
  if (!tariff) return null;
  return await tariff.update(updates);
};

export const deleteTariff = async (id: number) => {
  const tariff = await Tariff.findByPk(id);
  if (!tariff) return null;
  await tariff.destroy();
  return true;
};
