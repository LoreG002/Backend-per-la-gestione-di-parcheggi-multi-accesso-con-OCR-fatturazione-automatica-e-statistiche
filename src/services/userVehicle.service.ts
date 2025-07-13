import * as UserVehicleDAO from "../dao/userVehicle.dao";
import { UserVehicle } from "../models/userVehicle.model";
import { User } from "../models/user.model";

export const createUserVehicle = UserVehicleDAO.createUserVehicle;

export const getUserVehiclesByUserId = UserVehicleDAO.getUserVehiclesByUserId;

export const deleteUserVehicle = UserVehicleDAO.deleteUserVehicle;

// ✅ Nuova funzione per operatori: tutti gli utenti con le targhe associate
export const getAllUsersWithVehicles = async () => {
  return UserVehicle.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "email"] // aggiungi qui le proprietà che vuoi mostrare
      }
    ],
    order: [["userId", "ASC"]]
  });
};
