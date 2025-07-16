import { Request, Response, NextFunction } from "express";
import * as StatsService from "../services/stats.service";
import { generateRevenuePDF } from "../helpers/stats.helper";
import { ApiError } from "../helpers/ApiError";

export const getRevenueStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate, format, parkingId } = req.query;

    if (!startDate || !endDate) {
      return next(new ApiError(400, "Le date di inizio e di fine sono obbligatorie."));
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return next(new ApiError(400, "Formato data non valido."));
    }

    let stats;

    if (parkingId !== undefined) {
      const parsed = parseInt(parkingId as string, 10);
      if (isNaN(parsed)) {
        return next(new ApiError(400, "Il parametro parkingId deve essere un numero valido."));
      }
      // ✅ Chiamata con parametro esplicitamente di tipo number
      stats = await StatsService.calculateRevenueStats(start, end, parsed);
    } else {
      // ✅ Chiamata solo con due parametri
      stats = await StatsService.calculateRevenueStats(start, end);
    }

    if (format === "pdf") {
      await generateRevenuePDF(stats, res);
    } else {
      res.json(stats);
    }
  } catch (error) {
    console.error("Errore nel calcolo dei guadagni:", error);
    next(error);
  }
};
