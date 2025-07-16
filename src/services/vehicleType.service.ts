import * as VehicleTypeDAO from "../dao/vehicleType.dao";

// Definisce l'interfaccia per l'input del tipo di veicolo
interface VehicleTypeInput {
  name: string;
  description?: string;
}

// Ottiene tutti i tipi di veicolo presenti nel sistema
export const getAllVehicleTypes = async () => {
  return await VehicleTypeDAO.getAllVehicleTypes();
};

// Aggiorna un tipo di veicolo specificato dall'ID con i nuovi dati forniti
export const updateVehicleType = async (id: number, updates: VehicleTypeInput) => {
  return await VehicleTypeDAO.updateVehicleType(id, updates);
};

// Elimina un tipo di veicolo specificato dall'ID
export const deleteVehicleType = async (id: number) => {
  return await VehicleTypeDAO.deleteVehicleType(id);
};
