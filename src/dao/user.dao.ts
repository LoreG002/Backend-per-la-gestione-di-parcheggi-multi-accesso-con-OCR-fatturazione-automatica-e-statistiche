import { User, UserAttributes } from "../models/user.model";

// Restituisce tutti gli utenti presenti nel database
export const getAllUsers = async () => {
  return await User.findAll();
};

// Cerca un utente per ID
export const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

// Crea un nuovo utente
export const createUser = async (data: Omit<UserAttributes, "id">) => {
  return await User.create(data);
};

// Aggiorna un utente se esiste, altrimenti restituisce null
export const updateUser = async (id: number, updates: Partial<UserAttributes>) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  // Normalizza il valore del credito (es. da stringa a numero)
  if (updates.credit !== undefined) {
    updates.credit = Number(updates.credit);
  }

  return await user.update(updates);
};

// Elimina un utente se esiste, altrimenti restituisce null
export const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
};

// Restituisce un utente cercando per email (usato tipicamente nel login)
export const getUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

