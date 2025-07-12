import { Op } from "sequelize";
import { Transit, TransitAttributes } from "../models/transit.model";

export const createTransit = async (data: Omit<TransitAttributes, "id">) => {
  return await Transit.create(data);
};

export const updateTransit = async (id: number, updates: Partial<TransitAttributes>) => {
  const transit = await Transit.findByPk(id);
  if (!transit) return null;
  return await transit.update(updates);
};

export const deleteTransit = async (id: number) => {
  const transit = await Transit.findByPk(id);
  if (!transit) return null;
  await transit.destroy();
  return true;
};

export const getAllTransits = async (whereCondition = {}) => {
  return await Transit.findAll({
    where: whereCondition,
    include: ["Gate", "VehicleType", "Invoice"],
    order: [["timestamp", "DESC"]],
  });
};

export const findLatestEntranceWithoutInvoice = async (plate: string) => {
  return await Transit.findOne({
    where: { plate, direction: "entrata", invoiceId: null },
    order: [["timestamp", "DESC"]],
  });
};

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
