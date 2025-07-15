import { UserVehicle } from "../models/userVehicle.model";

// Crea un'associazione tra utente e veicolo
export const createUserVehicle = async (data: {
  userId: number;
  plate: string;
  vehicleTypeId: number;
}) => {
  return await UserVehicle.create(data);
};

// Restituisce tutti i veicoli associati a uno specifico utente
export const getUserVehiclesByUserId = async (userId: number) => {
  return await UserVehicle.findAll({ where: { userId } });
};

// Elimina un veicolo associato all'utente, se esiste
export const deleteUserVehicle = async (id: number) => {
  const userVehicle = await UserVehicle.findByPk(id);
  if (!userVehicle) return null;
  await userVehicle.destroy();
  return true;
};

