import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Interfaccia TypeScript per gli attributi dell'utente
export interface UserAttributes {
  id?: number;
  email: string;
  passwordHash: string;
  role: "utente" | "operatore"; // Ruolo dell'utente nel sistema
  credit: number;               // Credito disponibile
}

// Classe User che estende il modello Sequelize
export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public role!: "utente" | "operatore";
  public credit!: number;
}

// Inizializzazione del modello
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ogni email deve essere unica
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false, // La password è salvata in formato hash
    },
    role: {
      type: DataTypes.ENUM("utente", "operatore"),
      allowNull: false, // Solo due ruoli ammessi
    },
    credit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0, // Parte da 0 credito
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false, // Nessun campo createdAt/updatedAt
  }
);
