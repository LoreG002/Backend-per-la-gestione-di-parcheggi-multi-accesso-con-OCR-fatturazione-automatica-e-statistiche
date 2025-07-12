import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Invoice } from "../models/invoice.model";
import { User } from "../models/user.model";
import { Response } from "express";

export const generateInvoicePDF = async (
  invoice: Invoice & { User: User },
  res: Response
) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=fattura-${invoice.id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(16).text("FATTURA", { align: "center", underline: true }).moveDown();

  doc.fontSize(12).text(`ID Fattura: ${invoice.id}`);
  doc.text(`Utente: ${invoice.User.email}`);
  doc.text(`Importo: €${invoice.amount}`);
  doc.text(`Stato: ${invoice.status}`);
  doc.text(`Data creazione: ${invoice.createdAt.toLocaleString()}`);
  doc.text(`Scadenza: ${invoice.dueDate.toLocaleString()}`).moveDown();

  // QR code con dati fattura
  const qrData = `${invoice.userId}|${invoice.id}|${invoice.amount}`;
  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, {
    fit: [100, 100],
    align: "center",
    valign: "center",
  });

  doc.end();
};
