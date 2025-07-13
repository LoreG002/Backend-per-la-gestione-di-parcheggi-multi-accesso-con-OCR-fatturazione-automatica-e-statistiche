import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Invoice } from "../models/invoice.model";
import { User } from "../models/user.model";
import { Transit } from "../models/transit.model";
import { Response } from "express";
import { Gate } from "../models/gate.model";
import { VehicleType } from "../models/vehicleType.model";

// 🔹 Fattura PDF
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

  const qrData = `${invoice.userId}|${invoice.id}|${invoice.amount}`;
  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, {
    fit: [100, 100],
    align: "center",
    valign: "center",
  });

  doc.end();
};

// 🔹 Transiti PDF
export const generateTransitPDF = (
  transits: (Transit & {
    Gate?: Gate;
    VehicleType?: VehicleType;
    Invoice?: Invoice;
  })[],
  res: Response
): void => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=transits.pdf");

  doc.pipe(res);
  doc.fontSize(16).text("Report Transiti", { underline: true }).moveDown();

  transits.forEach((t, i) => {
    doc.fontSize(12).text(`Targa: ${t.plate}`);
    doc.text(`Data: ${t.timestamp}`);
    doc.text(`Varco: ${t.Gate?.name ?? "N/A"}`);
    doc.text(`Direzione: ${t.direction}`);
    doc.text(`Tipo veicolo: ${t.VehicleType?.name ?? "N/A"}`);
    doc.text(`Costo: € ${t.Invoice?.amount ?? "N/A"}`);
    if (i < transits.length - 1) doc.moveDown();
    doc.moveDown();
  });

  doc.end();
};
