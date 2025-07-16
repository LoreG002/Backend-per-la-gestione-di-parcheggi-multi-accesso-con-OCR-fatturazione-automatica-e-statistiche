import * as UserDAO from "../dao/user.dao";
import { verifyPassword, generateToken } from "../helpers/auth.helper";

export const login = async (email: string, password: string): Promise<string | null> => {
  // Recupera l'utente usando il DAO
  const user = await UserDAO.getUserByEmail(email);
  if (!user) return null;

  // Verifica che la password corrisponda all'hash
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  // Genera il token JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return token;
};
