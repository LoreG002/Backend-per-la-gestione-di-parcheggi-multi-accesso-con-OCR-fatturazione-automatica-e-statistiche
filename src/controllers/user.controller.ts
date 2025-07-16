import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApiError } from "../helpers/ApiError";
import * as UserService from "../services/user.service";

// Restituisce tutti gli utenti (solo per operatori). Gli utenti normali vedono solo se stessi.
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.role === "utente" ? req.user.id : undefined;

    let users;
    if (userId) {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return next(new ApiError(404, "Utente non trovato."));
      }
      users = [user];
    } else {
      users = await UserService.getAllUsers();
    }

    res.json(users);
  } catch (error) {
    console.error("Errore nel restituire gli utenti:", error);
    next(error);
  }
};

// Restituisce un singolo utente tramite ID
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

// Crea un nuovo utente con i dati forniti nel body
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    next(error);
  }
};

// Ricarica il credito di un utente specifico (solo operatori)
export const rechargeUserCredit = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const { amount } = req.body;

    if (isNaN(userId)) {
      return next(new ApiError(400, "ID utente non valido."));
    }

    if (typeof amount !== "number" || amount <= 0) {
      return next(new ApiError(400, "L'importo della ricarica deve essere un numero positivo."));
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return next(new ApiError(404, "Utente non trovato."));
    }

    const updatedUser = await UserService.updateUserCredit(userId, amount);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Errore durante la ricarica del credito:", error);
    next(error);
  }
};

// Elimina un utente tramite ID
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

