import { Request, Response } from "express";
import * as UserService from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Errore in getAllUsers:", error);
    res.status(500).json({ message: "Errore nel recupero degli utenti." });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Errore in getUserById:", error);
    res.status(500).json({ message: "Errore nel recupero dell'utente." });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Errore in createUser:", error);
    res.status(500).json({ message: "Errore nella creazione dell'utente." });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserService.updateUser(Number(req.params.id), req.body);
    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Errore in updateUser:", error);
    res.status(500).json({ message: "Errore nell'aggiornamento dell'utente." });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await UserService.deleteUser(Number(req.params.id));
    if (!success) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }
    res.json({ message: "Utente eliminato con successo." });
  } catch (error) {
    console.error("Errore in deleteUser:", error);
    res.status(500).json({ message: "Errore nell'eliminazione dell'utente." });
  }
};
