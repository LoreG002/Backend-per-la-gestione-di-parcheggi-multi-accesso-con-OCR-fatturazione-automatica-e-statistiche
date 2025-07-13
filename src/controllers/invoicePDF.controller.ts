import { Response, NextFunction } from "express";
import { Invoice } from "../models/invoice.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateInvoicePDF } from "../helpers/pdf.helper";
import { ApiError } from "../helpers/ApiError";

export const getInvoicePdf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      return next(new ApiError(404, "Fattura non trovata."));
    }

    // 🔐 Controllo accesso
    if (req.user?.role === "utente" && invoice.userId !== req.user.id) {
      return next(new ApiError(403, "Accesso negato: la fattura non ti appartiene."));
    }

    // ✅ Generazione del PDF (passando res)
    await generateInvoicePDF(invoice as any, res);
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    next(error);
  }
};
