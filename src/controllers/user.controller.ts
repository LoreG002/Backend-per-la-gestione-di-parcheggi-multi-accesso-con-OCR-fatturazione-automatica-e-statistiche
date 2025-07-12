import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/user.service";
import { ApiError } from "../helpers/ApiError";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Errore in getAllUsers:", error);
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserService.getUserById(Number(req.params.id));
    if (!user) {
      return next(new ApiError(404, "Utente non trovato."));
    }
    res.json(user);
  } catch (error) {
    console.error("Errore in getUserById:", error);
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Errore in createUser:", error);
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserService.updateUser(Number(req.params.id), req.body);
    if (!user) {
      return next(new ApiError(404, "Utente non trovato."));
    }
    res.json(user);
  } catch (error) {
    console.error("Errore in updateUser:", error);
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const success = await UserService.deleteUser(Number(req.params.id));
    if (!success) {
      return next(new ApiError(404, "Utente non trovato."));
    }
    res.json({ message: "Utente eliminato con successo." });
  } catch (error) {
    console.error("Errore in deleteUser:", error);
    next(error);
  }
};
