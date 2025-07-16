import PDFDocument from "pdfkit";
import { Response } from "express";

// Funzione per generare un PDF con le statistiche di fatturato dei parcheggi
export const generateRevenuePDF = async (
  stats: { parkingName: string; total: number }[],
  res: Response
) => {
  // Crea una nuova istandza di documento PDF
  const doc = new PDFDocument();

  // Imposta gli header della risposta per il PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=stats.pdf");

  // Collega il documento alla risposta
  doc.pipe(res);

  // Aggiungi titolo al PDF
  doc.fontSize(16).text("Report Fatturato Parcheggi", { underline: true }).moveDown();

  // Per ogni parcheggio, aggiungi una riga con il nome e il totale incassato
  stats.forEach(({ parkingName, total }) => {
    doc.fontSize(12).text(`Parcheggio: ${parkingName} - Totale: € ${total.toFixed(2)}`);
  });

  doc.end();
};
