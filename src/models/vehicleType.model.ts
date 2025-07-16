import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Interfaccia per tipizzare gli attributi del tipo di veicolo
export interface VehicleTypeAttributes {
  id?: number;           // ID univoco del tipo di veicolo (facoltativo perché autogenerato)
  name: string;          // Nome del tipo di veicolo (es. auto, moto, camion)
  description?: string;  // Descrizione opzionale
}

// Modello Sequelize per il tipo di veicolo
export class VehicleType extends Model<VehicleTypeAttributes> implements VehicleTypeAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
}

// Inizializzazione del modello con definizione dei campi
VehicleType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,   // Generazione automatica dell'ID
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,      // Il nome è obbligatorio
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,       // La descrizione è facoltativa
    },
  },
  {
    sequelize,                // Connessione al database
    tableName: "vehicle_types", // Nome della tabella nel DB
    timestamps: false,         // Disattiva i campi createdAt/updatedAt
  }
);
