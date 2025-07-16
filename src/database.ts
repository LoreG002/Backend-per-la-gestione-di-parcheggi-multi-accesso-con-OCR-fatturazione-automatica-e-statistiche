import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Sequelize;

  private constructor() {} // Costruttore privato per impedire l'istanziazione

  public static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize(
        process.env.DB_NAME as string,
        process.env.DB_USER as string,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          dialect: "postgres",
          logging: false // puoi mettere true per vedere le query
        }
      );
    }
    return Database.instance;
  }

  public static async testConnection() {
    try {
      await Database.getInstance().authenticate();
      console.log("Connessione al database avvenuta!");
    } catch (error) {
      console.error("Errore di connessione al database:", error);
    }
  }
}

// Export delle due funzioni
export const sequelize = Database.getInstance();
export const testConnection = Database.testConnection;