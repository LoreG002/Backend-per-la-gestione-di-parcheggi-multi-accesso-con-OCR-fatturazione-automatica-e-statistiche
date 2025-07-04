import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface TariffAttributes {
  id?: number;
  vehicleTypeId: number;
  startHour: number;
  endHour: number;
  dayType: "feriale" | "festivo";
  pricePerHour: number;
}

export class Tariff extends Model<TariffAttributes> implements TariffAttributes {
  public id!: number;
  public vehicleTypeId!: number;
  public startHour!: number;
  public endHour!: number;
  public dayType!: "feriale" | "festivo";
  public pricePerHour!: number;
}

Tariff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicleTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vehicle_types",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayType: {
      type: DataTypes.ENUM("feriale", "festivo"),
      allowNull: false,
    },
    pricePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "tariffs",
    timestamps: false,
  }
);