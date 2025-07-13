import * as TariffDAO from "../dao/tariff.dao";
import { TariffAttributes } from "../models/tariff.model";

export const getAllTariffs = TariffDAO.getAllTariffs;

export const createTariff = async (data: Omit<TariffAttributes, "id">) => {
  return await TariffDAO.createTariff(data);
};

export const updateTariff = async (id: number, data: Partial<TariffAttributes>) => {
  return await TariffDAO.updateTariff(id, data);
};

export const deleteTariff = async (id: number) => {
  return await TariffDAO.deleteTariff(id);
};
