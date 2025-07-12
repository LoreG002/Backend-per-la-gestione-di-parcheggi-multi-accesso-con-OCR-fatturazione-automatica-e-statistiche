import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import * as TransitService from "../services/transit.service";
import { generateTransitPDF } from "../helpers/pdf.helper";
import Tesseract from "tesseract.js";
import { UserVehicle } from "../models/userVehicle.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Gate } from "../models/gate.model";
import { VehicleType } from "../models/vehicleType.model";
import { Invoice } from "../models/invoice.model";
import { Transit } from "../models/transit.model";
import { ApiError } from "../helpers/ApiError";

export const createTransitAuto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gateId = parseInt(req.body.gateId);
    const gate = await Gate.findByPk(gateId);
    if (!gate) {
      return next(new ApiError(404, "Varco non trovato"));
    }

    if (gate.type === "standard") {
      if (!req.file) {
        return next(new ApiError(400, "Immagine Targa non trovata."));
      }

      const result = await Tesseract.recognize(req.file.path, "eng");
      const plateRaw = result.data.text.trim().toUpperCase();
      const plate = plateRaw.replace(/[^A-Z0-9]/g, "");

      const transit = await TransitService.createTransit({
        plate,
        gateId,
        vehicleTypeId: parseInt(req.body.vehicleTypeId),
        timestamp: new Date(),
        direction: "entrata",
        invoiceId: null,
      });

      res.status(201).json({ message: "Transito creato con OCR.", plate, transit });
    } else {
      const transit = await TransitService.createTransit({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(transit);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllTransits = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const whereCondition: any = {};

    if (req.user.role === "utente") {
      const userVehicles = await UserVehicle.findAll({ where: { userId: req.user.id } });
      const plates = userVehicles.map(v => v.plate);
      if (plates.length === 0) {
        res.json([]);
        return;
      }
      whereCondition.plate = { [Op.in]: plates };
    }

    const transits = await TransitService.getAllTransits(whereCondition);
    res.json(transits);
  } catch (error) {
    console.error("Errore getAllTransits:", error);
    next(error);
  }
};

export const searchTransits = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { plates, from, to, format } = req.body;

    if (!plates || !Array.isArray(plates) || plates.length === 0) {
      return next(new ApiError(400, "Devi specificare almeno una targa."));
    }

    let allowedPlates = plates;
    if (req.user.role !== "operatore") {
      const vehicles = await UserVehicle.findAll({ where: { userId: req.user.id } });
      const userPlates = vehicles.map(v => v.plate);
      allowedPlates = plates.filter(p => userPlates.includes(p));
    }

    if (allowedPlates.length === 0) {
      return next(new ApiError(403, "Nessuna targa autorizzata."));
    }

    const transits = await TransitService.searchTransits(
      allowedPlates,
      new Date(from),
      new Date(to)
    ) as (Transit & {
      Gate?: Gate;
      VehicleType?: VehicleType;
      Invoice?: Invoice;
    })[];

    if (format === "pdf") {
      generateTransitPDF(transits, res);
    } else {
      res.json(transits);
    }
  } catch (error) {
    console.error("Errore searchTransits:", error);
    next(error);
  }
};

export const updateTransit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await TransitService.updateTransit(parseInt(req.params.id), req.body);
    if (!updated) {
      return next(new ApiError(404, "Transito non trovato."));
    }
    res.json(updated);
  } catch (error) {
    console.error("Errore updateTransit:", error);
    next(error);
  }
};

export const deleteTransit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await TransitService.deleteTransit(parseInt(req.params.id));
    if (!deleted) {
      return next(new ApiError(404, "Transito non trovato."));
    }
    res.json({ message: "Transito eliminato con successo." });
  } catch (error) {
    console.error("Errore deleteTransit:", error);
    next(error);
  }
};
