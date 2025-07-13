import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../helpers/ApiError";
import * as UserService from "../services/user.service";

export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.role === "utente" ? req.user.id : undefined;

    let users;
    if (userId) {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return next(new ApiError(404, "Utente non trovato."));
      }
      users = [user]; // restituisce solo se stesso
    } else {
      users = await UserService.getAllUsers(); // operatore → tutti
    }

    res.json(users);
  } catch (error) {
    console.error("Errore nel restituire gli utenti:", error);
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
    console.error("Errore nel restituire l'utente:", error);
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
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
    console.error("Errore nella modifica dell'utente:", error);
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
    console.error("Errore nell'eliminare l'utente:", error);
    next(error);
  }
};
