import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface VehicleTypeAttributes {
    id?: number;
    name: string;
    description?: string;
}

export class VehicleType extends Model<VehicleTypeAttributes> implements VehicleTypeAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
}

VehicleType.init(
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "vehicle_types",
    timestamps: false,
  }
);