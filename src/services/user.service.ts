import bcrypt from "bcrypt";
import * as UserDAO from "../dao/user.dao";

interface CreateUserInput {
  email: string;
  password: string;
  role: "utente" | "operatore";
  credit: number;
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

export const updateUserCredit = async (userId: number, amount: number) => {
  const user = await UserDAO.getUserById(userId);
  if (!user) return null;

  const current = Number(user.credit);
  const added = Number(amount);

  const updatedCredit = Math.round((current + added) * 100) / 100;

  return await UserDAO.updateUser(userId, { credit: updatedCredit });
};

export const deleteUser = async (id: number) => {
  return await UserDAO.deleteUser(id);
};
