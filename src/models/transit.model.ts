import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Definizione degli attributi del modello Transit
export interface TransitAttributes {
  id?: number;
  plate: string;                      // Targa del veicolo
  vehicleTypeId: number;             // FK verso il tipo di veicolo
  gateId: number;                    // FK verso il varco
  timestamp: Date;                   // Data e ora del transito
  direction: "entrata" | "uscita";   // Direzione del passaggio
  invoiceId?: number | null;         // FK opzionale verso la fattura
}

// Definizione della classe Transit con eventuali join utili nel controller
export class Transit extends Model<TransitAttributes> implements TransitAttributes {
  public id!: number;
  public plate!: string;
  public vehicleTypeId!: number;
  public gateId!: number;
  public timestamp!: Date;
  public direction!: "entrata" | "uscita";
  public invoiceId!: number | null;

  // Attributi opzionali usati nei join
  Gate?: {
    id: number;
    name: string;
    direction: string;
    type: string;
  };
  VehicleType?: {
    name: string;
  };
  Invoice?: {
    amount: number;
  };
}

// Inizializzazione del modello Transit
Transit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
      onDelete: "RESTRICT", // Non elimina i transiti se si elimina il tipo di veicolo
    },
    gateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gates",
        key: "id",
      },
      onDelete: "RESTRICT", // Non elimina i transiti se si elimina il gate
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("entrata", "uscita"),
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "invoices",
        key: "id",
      },
      onDelete: "SET NULL", // Se la fattura viene eliminata, il campo viene messo a null
    },
  },
  {
    sequelize,
    tableName: "transits",
    timestamps: false, // Nessun campo createdAt o updatedAt
  }
);
