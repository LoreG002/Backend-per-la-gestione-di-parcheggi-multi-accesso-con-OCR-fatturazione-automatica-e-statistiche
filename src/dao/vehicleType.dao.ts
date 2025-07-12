import { VehicleType, VehicleTypeAttributes } from "../models/vehicleType.model";

export const getAllVehicleTypes = async () => {
  return await VehicleType.findAll();
};

export const getVehicleTypeById = async (id: number) => {
  return await VehicleType.findByPk(id);
};

export const updateVehicleType = async (id: number, updates: Partial<VehicleTypeAttributes>) => {
  const type = await VehicleType.findByPk(id);
  if (!type) return null;
  return await type.update(updates);
};

export const deleteVehicleType = async (id: number) => {
  const type = await VehicleType.findByPk(id);
  if (!type) return null;
  await type.destroy();
  return true;
};
