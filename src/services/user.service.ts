import bcrypt from "bcrypt";
import * as UserDAO from "../dao/user.dao";

// Definisce l'interfaccia per la creazione di un utente
interface CreateUserInput {
  email: string;
  password: string;
  role: "utente" | "operatore";
  credit: number;
}

// Ottiene tutti gli utenti dal database
export const getAllUsers = async () => {
  return await UserDAO.getAllUsers();
};

// Ottiene un singolo utente tramite il suo ID
export const getUserById = async (id: number) => {
  return await UserDAO.getUserById(id);
};

// Crea un nuovo utente
export const createUser = async (data: CreateUserInput) => {

  // Cripta la password usando bcrypt con 10 salt round
  const passwordHash = await bcrypt.hash(data.password, 10);

  // Chiama il DAO per salvare l'utente nel database
  return await UserDAO.createUser({
    email: data.email,
    passwordHash,
    role: data.role,
    credit: data.credit,
  });
};

// Ricarica il credito di un utente
export const updateUserCredit = async (userId: number, amount: number) => {
  const user = await UserDAO.getUserById(userId);
  if (!user) return null;

  const current = Number(user.credit);
  const added = Number(amount);

  const updatedCredit = Math.round((current + added) * 100) / 100;

  return await UserDAO.updateUser(userId, { credit: updatedCredit });
};

// Elimina un utente dal database
export const deleteUser = async (id: number) => {
  return await UserDAO.deleteUser(id);
};
