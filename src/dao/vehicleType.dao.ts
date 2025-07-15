import { VehicleType, VehicleTypeAttributes } from "../models/vehicleType.model";

// Restituisce tutti i tipi di veicolo presenti nel sistema
export const getAllVehicleTypes = async () => {
  return await VehicleType.findAll();
};

// Recupera un tipo di veicolo specifico tramite ID
export const getVehicleTypeById = async (id: number) => {
  return await VehicleType.findByPk(id);
};

// Aggiorna i campi di un tipo di veicolo esistente, se trovato
export const updateVehicleType = async (id: number, updates: Partial<VehicleTypeAttributes>) => {
  const type = await VehicleType.findByPk(id);
  if (!type) return null;
  return await type.update(updates);
};

// Elimina un tipo di veicolo se esiste
export const deleteVehicleType = async (id: number) => {
  const type = await VehicleType.findByPk(id);
  if (!type) return null;
  await type.destroy();
  return true;
};

