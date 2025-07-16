import { GateAttributes, Gate } from "../models/gate.model";

// Restituisce un singolo varco in base all'ID
export const getGateById = async (id: number) => {
  return await Gate.findByPk(id);
};

// Restituisce tutti i varchi presenti nel sistema
export const getAllGates = async () => {
  return await Gate.findAll();
};

// Crea un nuovo varco con i dati specificati (eccetto l'id, che è autogenerato)
export const createGate = async (data: Omit<GateAttributes, "id">) => {
  return await Gate.create(data);
};

// Aggiorna un varco esistente con i campi forniti; restituisce null se non trovato
export const updateGate = async (id: number, updates: Partial<GateAttributes>) => {
  const gate = await Gate.findByPk(id);
  if (!gate) return null;
  return await gate.update(updates);
};

// Elimina un varco se esiste; restituisce true se rimosso, altrimenti null
export const deleteGate = async (id: number) => {
  const gate = await Gate.findByPk(id);
  if (!gate) return null;
  await gate.destroy();
  return true;
};

