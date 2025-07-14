import { Request, Response, NextFunction } from "express";
import * as GateService from "../services/gate.service";
import { ApiError } from "../helpers/ApiError";

export const getAllGates = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gates = await GateService.getAllGates();
    res.json(gates);
  } catch (error) {
    next(error);
  }
};

export const getGateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gate = await GateService.getGateById(Number(req.params.id));
    if (!gate) {
      return next(new ApiError(404, "Varco non trovato."));
    }
    res.json(gate);
  } catch (error) {
    next(error);
  }
};

export const createGate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newGate = await GateService.createGate(req.body);
    res.status(201).json(newGate);
  } catch (error) {
    next(error);
  }
};

export const updateGate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const gate = await GateService.updateGate(Number(req.params.id), req.body);
    if (!gate) {
      return next(new ApiError(404, "Varco non trovato."));
    }
    res.json(gate);
  } catch (error) {
    next(error);
  }
};

export const deleteGate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await GateService.deleteGate(Number(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Varco non trovato."));
    }
    res.json({ message: "Varco eliminato con successo." });
  } catch (error) {
    next(error);
  }
};
