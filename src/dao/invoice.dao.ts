import { Invoice } from "../models/invoice.model";
import { Transit } from "../models/transit.model";
import { Op } from "sequelize";

/**
 * Recupera tutte le fatture.
 * Se è fornito un userId, filtra solo quelle associate all'utente.
 * Include anche eventuali transiti associati.
 */
export const getAllInvoices = async (userId?: number) => {
  const where = userId ? { userId } : {};
  return await Invoice.findAll({
    where,
    include: [{ model: Transit, required: false }],
  });
};

/**
 * Recupera le fatture filtrate per utente e altri parametri opzionali:
 * stato, intervallo di date di creazione, e targa.
 */
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

/**
 * Imposta lo stato della fattura come "pagato".
 * Se la fattura non esiste, restituisce null.
 */
export const payInvoice = async (id: number) => {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) return null;

  invoice.status = "pagato";
  await invoice.save();
  return invoice;
};

