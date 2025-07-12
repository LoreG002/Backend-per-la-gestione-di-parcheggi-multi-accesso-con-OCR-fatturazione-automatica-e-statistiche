import { Request, Response } from "express";
import { Invoice } from "../models/invoice.model";
import { User } from "../models/user.model";
import { generateInvoicePDF } from "../helpers/pdf.helper";

export const getInvoicePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoiceId = parseInt(req.params.id);

    const invoice = await Invoice.findByPk(invoiceId, {
      include: [User],
    });

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    // ✅ Type assertion per indicare che `User` è incluso
    await generateInvoicePDF(invoice as Invoice & { User: User }, res);
  } catch (error) {
    console.error("Errore generazione PDF:", error);
    res.status(500).json({ message: "Errore nella generazione del PDF." });
  }
};
