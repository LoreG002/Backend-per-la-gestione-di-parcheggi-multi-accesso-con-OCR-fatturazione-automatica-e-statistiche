import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Invoice } from "../models/invoice.model";
import { User } from "../models/user.model";
import { Transit } from "../models/transit.model";
import { Response } from "express";
import { Gate } from "../models/gate.model";
import { VehicleType } from "../models/vehicleType.model";

/*
* Genera un PDF contente i dettagli di una fattura
* include un QR code con i dati della fattura
*/

export const generateInvoicePDF = async (
  invoice: Invoice & { User: User },
  res: Response
) => {
  const doc = new PDFDocument();

  // Imposta le intestazioni della risposta per il PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=fattura-${invoice.id}.pdf`
  );

  // Collega il documento alla risposta
  doc.pipe(res);

  // Dettagli della fattura
  doc.fontSize(16).text("FATTURA", { align: "center", underline: true }).moveDown();

  doc.fontSize(12).text(`ID Fattura: ${invoice.id}`);
  doc.text(`Utente: ${invoice.User.id}`);
  doc.text(`Importo: €${invoice.amount}`);
  doc.text(`Stato: ${invoice.status}`);
  doc.text(`Data creazione: ${invoice.createdAt.toLocaleString()}`);
  doc.text(`Scadenza: ${invoice.dueDate.toLocaleString()}`).moveDown();

  // Crea il QR code con i dati della fattura
  const qrData = `"UserId: "${invoice.userId}|"InvoiceId: " ${invoice.id}|"Importo: "${invoice.amount}`;
  const qrImage = await QRCode.toDataURL(qrData);

  // Aggiungi il QR code al PDF
  doc.image(qrImage, {
    fit: [100, 100],
    align: "center",
    valign: "center",
  });

  doc.end();
};

/*
* Genera un PDF con i transiti
* includendo informazioni su targa, data, varco, direzione, veicolo, costo
*/
export const generateTransitPDF = (
  transits: (Transit & {
    Gate?: Gate;
    VehicleType?: VehicleType;
    Invoice?: Invoice;
  })[],
  res: Response
): void => {
  const doc = new PDFDocument();

  // Imposta le intestazioni della risposta per il PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=transits.pdf");

  // Collega il documento alla risposta
  doc.pipe(res);

  // Aggiungi titolo al PDF
  doc.fontSize(16).text("Report Transiti", { underline: true }).moveDown();

  // Per ogni transito, aggiungi i dettagli
  transits.forEach((t, i) => {
    doc.fontSize(12).text(`Targa: ${t.plate}`);
    doc.text(`Data: ${t.timestamp}`);
    doc.text(`Varco: ${t.Gate?.name ?? "N/A"}`);
    doc.text(`Direzione: ${t.direction}`);
    doc.text(`Tipo veicolo: ${t.VehicleType?.name ?? "N/A"}`);
    doc.text(`Costo: € ${t.Invoice?.amount ?? "N/A"}`);

    // Spazio tra un record e l'altro
    if (i < transits.length - 1) doc.moveDown();
    doc.moveDown();
  });

  doc.end();
};
