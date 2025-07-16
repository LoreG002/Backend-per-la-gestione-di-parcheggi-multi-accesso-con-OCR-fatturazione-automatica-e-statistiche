import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Interfaccia che definisce gli attributi del modello Tariffa
export interface TariffAttributes {
  id?: number;                 // ID generato automaticamente dal DB
  parkingId: number;          // Parcheggio associato alla tariffa
  vehicleTypeId: number;      // Tipo di veicolo associato
  startHour: number;          // Ora di inizio della tariffazione (es. 8 per le 8:00)
  endHour: number;            // Ora di fine della tariffazione (es. 18 per le 18:00)
  dayType: "feriale" | "festivo"; // Tipo di giorno (lavorativo o festivo)
  pricePerHour: number;       // Prezzo orario
}

// Classe Tariff che estende Model e implementa TariffAttributes
export class Tariff extends Model<TariffAttributes> implements TariffAttributes {
  public id!: number;
  public parkingId!: number;
  public vehicleTypeId!: number;
  public startHour!: number;
  public endHour!: number;
  public dayType!: "feriale" | "festivo";
  public pricePerHour!: number;
}

// Inizializzazione del modello Tariff
Tariff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,               // Chiave primaria
    },
    parkingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "parkings",           // Nome della tabella Parking
        key: "id",
      },
      onDelete: "CASCADE",           // Elimina le tariffe associate se viene eliminato il parcheggio
    },
    vehicleTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",      // Nome della tabella VehicleType
        key: "id",
      },
      onDelete: "CASCADE",           // Elimina le tariffe associate se viene eliminato il tipo di veicolo
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,              // Campo obbligatorio
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: false,              // Campo obbligatorio
    },
    dayType: {
      type: DataTypes.ENUM("feriale", "festivo"),
      allowNull: false,              // Solo valori ammessi: feriale o festivo
    },
    pricePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,              // Prezzo obbligatorio
    },
  },
  {
    sequelize,                        // Connessione al database
    tableName: "tariffs",             // Nome della tabella nel DB
    timestamps: false,                // Disabilita createdAt e updatedAt
  }
);

