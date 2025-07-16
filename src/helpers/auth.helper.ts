import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError";

// Verifica che la variabile d'ambiente JWT_SECRET sia definita
if (!process.env.JWT_SECRET) {
  // Se non lo è, solleva un errore strutturato (gestibile da error middleware)
  throw new ApiError(500, "JWT_SECRET non definito nelle variabili d'ambiente");
}

// Cast esplicito: TypeScript ora sa che è sicuramente una stringa
const JWT_SECRET = process.env.JWT_SECRET as string;

// Crea un hash della password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verifica se la password corrisponde all'hash
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Genera un token JWT con il payload specificato
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

// Verifica la validità del token JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};