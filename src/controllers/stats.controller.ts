import { Request, Response, NextFunction } from "express";
import * as StatsService from "../services/stats.service";
import { generateRevenuePDF } from "../helpers/stats.helper";
import { ApiError } from "../helpers/ApiError";

export const getRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, format } = req.query;

    if (!startDate || !endDate) {
      return next(new ApiError(400, "Le date di inizio e di fine sono obbligatorie."));
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const stats = await StatsService.calculateRevenueStats(start, end);

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
