import { Response, NextFunction } from "express";
import { Invoice } from "../models/invoice.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateInvoicePDF } from "../helpers/pdf.helper";
import { ApiError } from "../helpers/ApiError";
import { User } from "../models/user.model";

export const getInvoicePdf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoice = await Invoice.findByPk(invoiceId, {
      include: [{ model: User }],
    });

    if (!invoice) {
      return next(new ApiError(404, "Fattura non trovata."));
    }

    // 🔐 Controllo accesso
    if (req.user?.role === "utente" && invoice.userId !== req.user.id) {
      return next(new ApiError(403, "Accesso negato: la fattura non ti appartiene."));
    }

    // ✅ Generazione PDF
    await generateInvoicePDF(invoice as any, res);
    // ⚠️ Non chiamare next() qui! La risposta è già stata inviata dal PDF
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    // Se res è già stato scritto, evita doppia risposta
    if (!res.headersSent) {
      next(new ApiError(500, "Errore nella generazione del PDF."));
    }
  }
};
