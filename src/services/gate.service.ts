import * as GateDAO from "../dao/gate.dao";

interface GateInput {
  name: string;
  parkingId: number;
  type: "standard" | "smart";
  direction: "entrata" | "uscita" | "bidirezionale";
}

export const updateGate = async (id: number, updates: GateInput) => {
  return await GateDAO.updateGate(id, updates);
};

export const deleteGate = async (id: number) => {
  return await GateDAO.deleteGate(id);
};
