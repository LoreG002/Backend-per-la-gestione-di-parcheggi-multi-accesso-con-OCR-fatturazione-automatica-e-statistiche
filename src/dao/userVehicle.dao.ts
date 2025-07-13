import { UserVehicle } from "../models/userVehicle.model";

export const createUserVehicle = async (data: {
  userId: number;
  plate: string;
  vehicleTypeId: number;
}) => {
  return await UserVehicle.create(data);
};

export const getUserVehiclesByUserId = async (userId: number) => {
  return await UserVehicle.findAll({ where: { userId } });
};

export const deleteUserVehicle = async (id: number) => {
  const userVehicle = await UserVehicle.findByPk(id);
  if (!userVehicle) return null;
  await userVehicle.destroy();
  return true;
};
