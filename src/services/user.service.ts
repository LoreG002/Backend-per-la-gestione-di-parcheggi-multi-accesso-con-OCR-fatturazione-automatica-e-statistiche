import bcrypt from "bcrypt";
import * as UserDAO from "../dao/user.dao";
import { UserAttributes } from "../models/user.model";

interface CreateUserInput {
  email: string;
  password: string;
  role: "utente" | "operatore";
  credit: number;
}

interface UpdateUserInput {
  email?: string;
  password?: string;
  role?: "utente" | "operatore";
  credit?: number;
}

export const getAllUsers = async () => {
  return await UserDAO.getAllUsers();
};

export const getUserById = async (id: number) => {
  return await UserDAO.getUserById(id);
};

export const createUser = async (data: CreateUserInput) => {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return await UserDAO.createUser({
    email: data.email,
    passwordHash,
    role: data.role,
    credit: data.credit,
  });
};

export const updateUser = async (id: number, updates: UpdateUserInput) => {
  const user = await UserDAO.getUserById(id);
  if (!user) return null;

  const updatedData: Partial<UserAttributes> = {
    email: updates.email ?? user.email,
    role: updates.role ?? user.role,
    credit: updates.credit ?? user.credit,
  };

  if (updates.password) {
    updatedData.passwordHash = await bcrypt.hash(updates.password, 10);
  }

  return await UserDAO.updateUser(id, updatedData);
};

export const deleteUser = async (id: number) => {
  return await UserDAO.deleteUser(id);
};
