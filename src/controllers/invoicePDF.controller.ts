import { Response, NextFunction } from "express";
import { Invoice } from "../models/invoice.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateInvoicePDF } from "../helpers/pdf.helper";
import { ApiError } from "../helpers/ApiError";
import { User } from "../models/user.model";

// Restituisce la versione PDF di una fattura, se autorizzato
export const getInvoicePdf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    // Recupera la fattura con l’utente associato
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: User }],
    });

    if (!invoice) {
      return next(new ApiError(404, "Fattura non trovata."));
    }

    // Autorizzazione: un utente può scaricare solo le proprie fatture
    if (req.user?.role === "utente" && invoice.userId !== req.user.id) {
      return next(new ApiError(403, "Accesso negato: la fattura non ti appartiene."));
    }

    // Generazione e invio del PDF direttamente nella risposta
    await generateInvoicePDF(invoice as any, res);

    // ⚠️ Nessuna chiamata a next(): la risposta è già stata inviata dal PDF helper
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);

    // Evita doppia risposta se il PDF è già stato inviato
    if (!res.headersSent) {
      next(new ApiError(500, "Errore nella generazione del PDF."));
    }
  }
};
