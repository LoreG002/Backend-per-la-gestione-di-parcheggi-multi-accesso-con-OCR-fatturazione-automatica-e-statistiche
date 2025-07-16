import * as UserVehicleDAO from "../dao/userVehicle.dao";
import { UserVehicle } from "../models/userVehicle.model";
import { User } from "../models/user.model";

// Esporta la funzione per creare una nuova associazione
export const createUserVehicle = UserVehicleDAO.createUserVehicle;

// Esporta la funzione per ottenere i veicoli associati a un determinato utente
export const getUserVehiclesByUserId = UserVehicleDAO.getUserVehiclesByUserId;

// Esporta la funzione per eliminare una targa associata a un utente
export const deleteUserVehicle = UserVehicleDAO.deleteUserVehicle;

// Restituisce tutte le targhe insieme ai dati dell'utente associato (solo per operatori)
export const getAllUsersWithVehicles = async () => {
  return UserVehicle.findAll({
    include: [
      {
        model: User,  // Fa il join con il modello User
        attributes: ["id", "email"] // Specifica solo gli attributi da restituire per User
      }
    ],
    order: [["userId", "ASC"]]
  });
};
