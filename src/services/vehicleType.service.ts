import * as VehicleTypeDAO from "../dao/vehicleType.dao";

interface VehicleTypeInput {
  name: string;
  description?: string;
}

export const getAllVehicleTypes = async () => {
  return await VehicleTypeDAO.getAllVehicleTypes();
};

export const updateVehicleType = async (id: number, updates: VehicleTypeInput) => {
  return await VehicleTypeDAO.updateVehicleType(id, updates);
};

export const deleteVehicleType = async (id: number) => {
  return await VehicleTypeDAO.deleteVehicleType(id);
};
