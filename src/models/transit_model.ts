import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";
import { Gate } from "./gate_model";
import { VehicleType } from "./vehicleType_model";
import { Invoice } from "./invoice_model";

export interface TransitAttributes {
  id?: number;
  plate: string;
  vehicleTypeId: number;
  gateId: number;
  timestamp: Date;
  direction: "entrata" | "uscita";
  invoiceId?: number | null;
}

export class Transit extends Model<TransitAttributes> implements TransitAttributes {
  public id!: number;
  public plate!: string;
  public vehicleTypeId!: number;
  public gateId!: number;
  public timestamp!: Date;
  public direction!: "entrata" | "uscita";
  public invoiceId!: number | null;

  public gate?: Gate;
  public vehicleType?: VehicleType;
  public invoice?: Invoice;
}

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
      onDelete: "RESTRICT",
    },
    gateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gates",
        key: "id",
      },
      onDelete: "RESTRICT",
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
      onDelete: "SET NULL",
    },
  },
  {
    sequelize,
    tableName: "transits",
    timestamps: false,
  }
);