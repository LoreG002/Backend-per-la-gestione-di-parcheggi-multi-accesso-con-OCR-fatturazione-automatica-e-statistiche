import PDFDocument from "pdfkit";
import { Response } from "express";
import { Transit } from "../models/transit.model";

export const generateTransitPDF = (res: Response, transits: Transit[]) => {
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
