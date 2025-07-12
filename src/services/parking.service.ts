import * as ParkingDAO from "../dao/parking.dao";

interface ParkingInput {
  name: string;
  location: string;
  capacity: number;
}

export const createParking = async (data: ParkingInput) => {
  return await ParkingDAO.createParking(data);
};

export const updateParking = async (id: number, updates: ParkingInput) => {
  return await ParkingDAO.updateParking(id, updates);
};

export const deleteParking = async (id: number) => {
  return await ParkingDAO.deleteParking(id);
};

export const getParkingById = async (id: number) => {
  return await ParkingDAO.getParkingById(id);
};
