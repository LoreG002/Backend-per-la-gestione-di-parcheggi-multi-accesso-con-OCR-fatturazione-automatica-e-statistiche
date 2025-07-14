import * as GateDAO from "../dao/gate.dao";

interface GateInput {
  name: string;
  parkingId: number;
  type: "standard" | "smart";
  direction: "entrata" | "uscita" | "bidirezionale";
}

export const getAllGates = async () => {
  return await GateDAO.getAllGates();
};

export const getGateById = async (id: number) => {
  return await GateDAO.getGateById(id);
};

export const createGate = async (data: GateInput) => {
  return await GateDAO.createGate(data);
};

export const updateGate = async (id: number, updates: GateInput) => {
  return await GateDAO.updateGate(id, updates);
};

export const deleteGate = async (id: number) => {
  return await GateDAO.deleteGate(id);
};
