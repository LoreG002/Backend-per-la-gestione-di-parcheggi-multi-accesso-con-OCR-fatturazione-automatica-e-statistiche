import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export class UserVehicle extends Model {
  public id!: number;
  public userId!: number;
  public plate!: string;
}

UserVehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "UserVehicle",
    tableName: "user_vehicles",
    timestamps: false,
  }
);
