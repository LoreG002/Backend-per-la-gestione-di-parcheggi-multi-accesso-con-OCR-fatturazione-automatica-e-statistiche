import { Response } from "express";
import * as InvoiceService from "../services/invoice.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getAllInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.role === "utente" ? req.user.id : undefined;
    const invoices = await InvoiceService.getAllInvoices(userId);
    res.json(invoices);
  } catch (error) {
    console.error("Errore getAllInvoices:", error);
    res.status(500).json({ message: "Errore nel recupero delle fatture." });
  }
};

export const getInvoiceStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, start, end, plate } = req.query;
    const filters = {
      status: status as string,
      start: start as string,
      end: end as string,
      plate: plate as string,
    };

    const results = await InvoiceService.getInvoiceStatus(req.user.id, filters);
    res.json(results);
  } catch (error) {
    console.error("Errore getInvoiceStatus:", error);
    res.status(500).json({ message: "Errore nel recupero dello stato fatture." });
  }
};

export const payInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const updated = await InvoiceService.payInvoice(invoiceId);
    if (!updated) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Errore payInvoice:", error);
    res.status(500).json({ message: "Errore nel pagamento fattura." });
  }
};
