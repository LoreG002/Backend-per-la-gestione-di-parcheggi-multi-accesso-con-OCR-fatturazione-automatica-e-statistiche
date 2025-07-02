import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface GateAttributes {
  id?: number;
  name: string;
  parkingId: number;
  type: "standard" | "smart";
  direction: "entrata" | "uscita" | "bidirezionale";
}

export class Gate extends Model<GateAttributes> implements GateAttributes {
  public id!: number;
  public name!: string;
  public parkingId!: number;
  public type!: "standard" | "smart";
  public direction!: "entrata" | "uscita" | "bidirezionale";
}

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
        model: "parkings",
        key: "id",
      },
      onDelete: "CASCADE",  //se elimino un parcheggio si eliminano i gate
    },
    type: {
      type: DataTypes.ENUM("standard", "smart"),
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("entrata", "uscita", "bidirezionale"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "gates",
    timestamps: false,
  }
);