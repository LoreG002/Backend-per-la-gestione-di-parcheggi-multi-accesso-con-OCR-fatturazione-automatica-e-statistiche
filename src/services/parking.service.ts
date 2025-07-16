import * as ParkingDAO from "../dao/parking.dao";

// Definisce l'interfaccia per l'input di un nuovo parcheggio
interface ParkingInput {
  name: string;
  location: string;
  capacity: number;
}

// Crea un nuovo parcheggio usando i dati forniti
export const createParking = async (data: ParkingInput) => {
  return await ParkingDAO.createParking(data);
};

// Aggiorna un parcheggio esistente in base all'ID
export const updateParking = async (id: number, updates: ParkingInput) => {
  return await ParkingDAO.updateParking(id, updates);
};

// Elimina un parcheggio dato il suo ID
export const deleteParking = async (id: number) => {
  return await ParkingDAO.deleteParking(id);
};

// Recupera un parcheggio specifico dato il suo ID
export const getParkingById = async (id: number) => {
  return await ParkingDAO.getParkingById(id);
};
