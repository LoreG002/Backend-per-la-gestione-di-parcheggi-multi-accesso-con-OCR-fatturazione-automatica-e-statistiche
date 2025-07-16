import * as GateDAO from "../dao/gate.dao";

// Definisce l'interfaccia del tipo di input accettato per creare o aggiornare un gate
interface GateInput {
  name: string;
  parkingId: number;
  type: "standard" | "smart";
  direction: "entrata" | "uscita" | "bidirezionale";
}

// Recupera tutti i gate dal DAO
export const getAllGates = async () => {
  return await GateDAO.getAllGates();
};

// Recupera un gate specifico per ID dal DAO
export const getGateById = async (id: number) => {
  return await GateDAO.getGateById(id);
};

// Crea un nuovo gate usando i dati forniti
export const createGate = async (data: GateInput) => {
  return await GateDAO.createGate(data);
};

// Aggiorna un gate esistente specificando l'ID e i nuovi dati
export const updateGate = async (id: number, updates: GateInput) => {
  return await GateDAO.updateGate(id, updates);
};

// Elimina un gate esistente per ID
export const deleteGate = async (id: number) => {
  return await GateDAO.deleteGate(id);
};
