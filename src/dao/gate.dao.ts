import { GateAttributes, Gate } from "../models/gate.model";

export const getGateById = async (id: number) => {
  return await Gate.findByPk(id);
};

export const getAllGates = async () => {
  return await Gate.findAll();
};

export const createGate = async (data: Omit<GateAttributes, "id">) => {
  return await Gate.create(data);
};

export const updateGate = async (id: number, updates: Partial<GateAttributes>) => {
  const gate = await Gate.findByPk(id);
  if (!gate) return null;
  return await gate.update(updates);
};

export const deleteGate = async (id: number) => {
  const gate = await Gate.findByPk(id);
  if (!gate) return null;
  await gate.destroy();
  return true;
};
