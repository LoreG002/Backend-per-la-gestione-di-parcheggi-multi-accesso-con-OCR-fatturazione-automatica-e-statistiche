import { DataTypes, Model } from "sequelize"; // Model è la classe base di Sequelize, DataTypes definisce i tipi (STRING, INTEGER, ecc.)
import { sequelize } from "../database"; // Import della connessione al database

// Interfaccia che definisce gli attributi del modello Parking
export interface ParkingAttributes {
  id?: number;          // ID opzionale perché viene generato automaticamente dal DB
  name: string;         // Nome del parcheggio
  location: string;     // Posizione geografica o indirizzo
  capacity: number;     // Numero massimo di posti disponibili
}

// Classe Parking che estende Model e implementa ParkingAttributes
export class Parking extends Model<ParkingAttributes> implements ParkingAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
  public capacity!: number;
}

// Inizializzazione del modello Parking
Parking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,              // Chiave primaria
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,              // Campo obbligatorio
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,              // Campo obbligatorio
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,              // Campo obbligatorio
    },
  },
  {
    sequelize,                        // Collegamento alla connessione del database
    tableName: "parkings",            // Nome della tabella nel database
    timestamps: false,                // Disabilita i campi createdAt e updatedAt
  }
);
