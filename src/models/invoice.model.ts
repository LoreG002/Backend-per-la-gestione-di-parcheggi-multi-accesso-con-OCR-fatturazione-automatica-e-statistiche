import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

export interface InvoiceAttributes {
  id?: number;
  userId: number;
  amount: number;
  status: "pagato" | "non pagato";
  createdAt?: Date;
  dueDate: Date;
}

export class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public status!: "pagato" | "non pagato";
  public createdAt!: Date;
  public dueDate!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pagato", "non pagato"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "invoices",
    timestamps: false,
  }
);