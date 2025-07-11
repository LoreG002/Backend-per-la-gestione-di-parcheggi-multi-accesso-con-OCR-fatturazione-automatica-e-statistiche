import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      dialect: "postgres",
      logging: false,  //posso mettere true se voglio vedere le query in console

    }
);

export const testConnection = async () =>{
  try {
    await sequelize.authenticate();
    console.log("Connessione al database avvenuta!")
  } catch (error) {
    console.error("Errore di connessione al database:", error)
  }
};