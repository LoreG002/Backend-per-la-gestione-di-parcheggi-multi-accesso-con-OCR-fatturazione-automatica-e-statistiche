import { Request, Response, NextFunction } from "express";
import * as StatsService from "../services/stats.service";
import { generateRevenuePDF } from "../helpers/stats.helper";
import { ApiError } from "../helpers/ApiError";

// Funzione per ottenere le statistiche sui guadagni
export const getRevenueStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Estrazione dei parametri dalla query string
    const { startDate, endDate, format, parkingId } = req.query;

    // Verifica presenza obbligatoria di startDate e endDate
    if (!startDate || !endDate) {
      return next(new ApiError(400, "Le date di inizio e di fine sono obbligatorie."));
    }

    // Parsing delle date in oggetti Date
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Validazione delle date
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return next(new ApiError(400, "Formato data non valido."));
    }

    let stats;

    // Controllo se il parametro parkingId è presente
    if (parkingId !== undefined) {
      const parsed = parseInt(parkingId as string, 10);
      // Validazione del parametro parkingId
      if (isNaN(parsed)) {
        return next(new ApiError(400, "Il parametro parkingId deve essere un numero valido."));
      }
      // Calcolo delle statistiche con parkingId specificato
      stats = await StatsService.calculateRevenueStats(start, end, parsed);
    } else {
      // Calcolo delle statistiche generali senza parkingId
      stats = await StatsService.calculateRevenueStats(start, end);
    }

    // Se il formato richiesto è PDF, generazione del file
    if (format === "pdf") {
      await generateRevenuePDF(stats, res);
    } else {
      // Altrimenti ritorna i dati in formato JSON
      res.json(stats);
    }
  } catch (error) {
    // Gestione degli errori imprevisti
    console.error("Errore nel calcolo dei guadagni:", error);
    next(error);
  }
};
