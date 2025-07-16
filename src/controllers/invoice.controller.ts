import { Response, NextFunction } from "express";
import * as InvoiceService from "../services/invoice.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../helpers/ApiError";
import { Invoice } from "../models/invoice.model";

// Restituisce tutte le fatture visibili dall'utente autenticato.
// Gli utenti "utente" vedono solo le proprie, gli operatori tutte.
export const getAllInvoices = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.role === "utente" ? req.user.id : undefined;
    const invoices = await InvoiceService.getAllInvoices(userId);
    res.json(invoices);
  } catch (error) {
    console.error("Errore nel restituire tutte le fatture :", error);
    next(error);
  }
};

// Restituisce un elenco filtrato di fatture in base a stato, periodo e targa
export const getInvoiceStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    console.error("Errore nel restituire lo status della fattura:", error);
    next(error);
  }
};

// Permette all’utente di pagare una fattura associata al proprio account
export const payInvoice = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      throw new ApiError(404, "Fattura non trovata.");
    }

    // Controlla che l’utente possa pagare solo le proprie fatture
    if (req.user.role === "utente" && invoice.userId !== req.user.id) {
      throw new ApiError(403, "Non puoi pagare una fattura non associata al tuo account.");
    }

    const updated = await InvoiceService.payInvoice(invoiceId);
    res.json(updated);
  } catch (error) {
    console.error("Errore nel pagare la fattura:", error);
    next(error);
  }
};