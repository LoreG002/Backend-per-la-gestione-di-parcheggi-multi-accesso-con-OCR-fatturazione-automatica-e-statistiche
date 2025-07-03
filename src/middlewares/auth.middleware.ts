import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/auth_helper";

export interface AuthRequest extends Request {  //estente Request per avere anche req.user
  user?: any;
}

export const authenticateJWT = (
  req: AuthRequest, 
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization; //controllo la presenza dell'header

  if (!authHeader) {
    res.status(401).json({ message: "Token mancante" });
    return;
  }

  const token = authHeader.split(" ")[1]; // formato: "Bearer <token>" quindi estrae il token

  try {
    const decoded = verifyToken(token); //se è valido mette i dati dentro req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Token non valido" });
  }
};