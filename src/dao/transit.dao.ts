import { Op } from "sequelize";
import { Transit, TransitAttributes } from "../models/transit.model";

// Crea un nuovo transito
export const createTransit = async (data: Omit<TransitAttributes, "id">) => {
  return await Transit.create(data);
};

// Aggiorna un transito esistente se trovato, altrimenti restituisce null
export const updateTransit = async (id: number, updates: Partial<TransitAttributes>) => {
  const transit = await Transit.findByPk(id);
  if (!transit) return null;
  return await transit.update(updates);
};

// Elimina un transito se esistente, altrimenti restituisce null
export const deleteTransit = async (id: number) => {
  const transit = await Transit.findByPk(id);
  if (!transit) return null;
  await transit.destroy();
  return true;
};

// Restituisce tutti i transiti che soddisfano una certa condizione, includendo entità correlate
export const getAllTransits = async (whereCondition = {}) => {
  return await Transit.findAll({
    where: whereCondition,
    include: ["Gate", "VehicleType", "Invoice"],
    order: [["timestamp", "DESC"]],
  });
};

// Trova l'ultimo transito in entrata senza fattura associata per una determinata targa
export const findLatestEntranceWithoutInvoice = async (plate: string) => {
  return await Transit.findOne({
    where: { plate, direction: "entrata", invoiceId: null },
    order: [["timestamp", "DESC"]],
  });
};

// Cerca i transiti filtrando per targhe e intervallo temporale, includendo entità collegate
export const searchTransits = async (plates: string[], from: Date, to: Date) => {
  return await Transit.findAll({
    where: {
      plate: { [Op.in]: plates },
      timestamp: { [Op.between]: [from, to] },
    },
    include: ["Gate", "VehicleType", "Invoice"],
    order: [["timestamp", "ASC"]],
  });
};
