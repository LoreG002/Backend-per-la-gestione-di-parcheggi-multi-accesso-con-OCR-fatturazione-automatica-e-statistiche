import { Parking } from "../models/parking.model";
import { ParkingAttributes } from "../models/parking.model";

// Restituisce un parcheggio dato il suo ID
export const getParkingById = async (id: number) => {
  return await Parking.findByPk(id);
};

// Crea un nuovo parcheggio con i dati forniti (escludendo l'id)
export const createParking = async (data: Omit<ParkingAttributes, "id">) => {
  return await Parking.create(data);
};

// Aggiorna un parcheggio esistente se trovato, altrimenti restituisce null
export const updateParking = async (id: number, updates: Partial<ParkingAttributes>) => {
  const parking = await Parking.findByPk(id);
  if (!parking) return null;
  return await parking.update(updates);
};

// Elimina un parcheggio se esistente, altrimenti restituisce null
export const deleteParking = async (id: number) => {
  const parking = await Parking.findByPk(id);
  if (!parking) return null;
  await parking.destroy();
  return true;
};

