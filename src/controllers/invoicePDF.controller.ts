import { Response } from "express";
import { Invoice } from "../models/invoice.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateInvoicePDF } from "../helpers/pdf.helper"; // <-- la tua funzione

export const getInvoicePdf = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);
    const invoice = await Invoice.findByPk(invoiceId);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    // 🔐 Blocco utenti non autorizzati
    if (req.user?.role === "utente" && invoice.userId !== req.user.id) {
      res.status(403).json({ message: "Accesso negato: la fattura non ti appartiene." });
      return;
    }

    // ✅ Passa anche res alla funzione helper
    await generateInvoicePDF(invoice as any, res);
  } catch (error) {
    console.error("Errore nella generazione del PDF:", error);
    res.status(500).json({ message: "Errore interno durante la generazione del PDF." });
  }
};
