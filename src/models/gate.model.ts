import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Interfaccia che definisce gli attributi di un Gate
export interface GateAttributes {
  id?: number;
  name: string;
  parkingId: number;
  type: "standard" | "smart";
  direction: "entrata" | "uscita" | "bidirezionale";
}

// Classe Gate che estende il Model di Sequelize
export class Gate extends Model<GateAttributes> implements GateAttributes {
  public id!: number;
  public name!: string;
  public parkingId!: number;
  public type!: "standard" | "smart";
  public direction!: "entrata" | "uscita" | "bidirezionale";
}

// Inizializzazione del modello Gate
Gate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parkingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "parkings", // Relazione con la tabella Parkings
        key: "id",
      },
      onDelete: "CASCADE", // Elimina i gate associati se il parcheggio viene cancellato
    },
    type: {
      type: DataTypes.ENUM("standard", "smart"), // Tipo di gate
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("entrata", "uscita", "bidirezionale"), // Direzione supportata dal gate
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "gates",
    timestamps: false, // Disabilita i campi createdAt e updatedAt
  }
);
