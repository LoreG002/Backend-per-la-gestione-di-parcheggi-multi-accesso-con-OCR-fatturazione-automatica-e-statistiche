import PDFDocument from "pdfkit";
import { Response } from "express";

export const generateRevenuePDF = async (
  stats: { parkingName: string; total: number }[],
  res: Response
) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=stats.pdf");

  doc.pipe(res);
  doc.fontSize(16).text("Report Fatturato Parcheggi", { underline: true }).moveDown();

  stats.forEach(({ parkingName, total }) => {
    doc.fontSize(12).text(`Parcheggio: ${parkingName} - Totale: € ${total.toFixed(2)}`);
  });

  doc.end();
};
