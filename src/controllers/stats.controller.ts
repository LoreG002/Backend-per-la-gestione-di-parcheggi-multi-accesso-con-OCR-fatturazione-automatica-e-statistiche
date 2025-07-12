import { Request, Response } from "express";
import * as StatsService from "../services/stats.service";
import { generateRevenuePDF } from "../helpers/stats.helper";

export const getRevenueStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, format } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: "Le date di inizio e di fine sono obbligatorie." });
      return;
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
    console.error("Errore getRevenueStats:", error);
    res.status(500).json({ message: "Errore nel calcolo del fatturato." });
  }
};
