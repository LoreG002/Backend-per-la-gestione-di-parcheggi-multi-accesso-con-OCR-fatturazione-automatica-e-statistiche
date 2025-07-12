import { Invoice } from "../models/invoice.model";
import { Transit } from "../models/transit.model";
import { Op } from "sequelize";

export const getAllInvoices = async (userId?: number) => {
  const where = userId ? { userId } : {};
  return await Invoice.findAll({
    where,
    include: [{ model: Transit, required: false }],
  });
};

export const getInvoiceStatus = async (
  userId: number,
  filters: { status?: string; start?: string; end?: string; plate?: string }
) => {
  const where: any = { userId };

  if (filters.status) where.status = filters.status;
  if (filters.start && filters.end) {
    where.createdAt = {
      [Op.between]: [new Date(filters.start), new Date(filters.end)],
    };
  }

  return await Invoice.findAll({ where });
};

export const payInvoice = async (id: number) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return null;

  invoice.status = "pagato";
  await invoice.save();
  return invoice;
};
