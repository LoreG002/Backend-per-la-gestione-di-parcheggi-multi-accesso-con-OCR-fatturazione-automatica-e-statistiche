import { Parking } from "../models/parking.model";
import { ParkingAttributes } from "../models/parking.model";

export const getParkingById = async (id: number) => {
  return await Parking.findByPk(id);
};

export const createParking = async (data: Omit<ParkingAttributes, "id">) => {
  return await Parking.create(data);
};

export const updateParking = async (id: number, updates: Partial<ParkingAttributes>) => {
  const parking = await Parking.findByPk(id);
  if (!parking) return null;
  return await parking.update(updates);
};

export const deleteParking = async (id: number) => {
  const parking = await Parking.findByPk(id);
  if (!parking) return null;
  await parking.destroy();
  return true;
};
