import { Router } from "express";
import { Invoice } from "../models/invoice_model";
import { User } from "../models/user_model";
import PDFDocument from "pdfkit"
import QRCode from "qrcode";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/api/invoices/:id/pdf",authenticateJWT, async (req,res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {include: [User]});

    if (!invoice) {
      res.status(404).json({message: "Fattura non trovata"});
      return;
    }
    const qrString = `${invoice.userId}|${invoice.id}|${invoice.amount}`;

    const qrDataUrl = await QRCode.toDataURL(qrString);

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=fattura_${invoice.id}.pdf`);

    // Pipe del PDF alla risposta
    doc.pipe(res);

    doc.fontSize(20).text(`Fattura n. ${invoice.id}`, { align: "center" });
    doc.moveDown();

    // Dati fattura
    doc.fontSize(12).text(`Utente ID: ${invoice.userId}`);
    doc.text(`Importo: € ${invoice.amount}`);
    doc.text(`Stato: ${invoice.status}`);
    doc.text(`Data creazione: ${invoice.createdAt}`);
    doc.text(`Scadenza: ${invoice.dueDate}`);

    doc.moveDown();

    doc.text("Per procedere al pagamento, scansiona il QR code: ",  { align: "left" });

    // Inserisci QR code
    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(qrImage, "base64");

    doc.image(buffer, {
      fit: [150, 150],
      align: "center",
      valign: "center"
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione del pdf. "})
  }

});

export default router;
