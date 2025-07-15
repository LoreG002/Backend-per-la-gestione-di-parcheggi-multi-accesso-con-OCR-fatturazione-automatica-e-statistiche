import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Interfaccia che definisce gli attributi della fattura
export interface InvoiceAttributes {
  id?: number;
  userId: number;
  amount: number;
  status: "pagato" | "non pagato";
  createdAt?: Date;
  dueDate: Date;
}

// Classe Invoice che estende il Model di Sequelize
export class Invoice extends Model<InvoiceAttributes> implements InvoiceAttributes {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public status!: "pagato" | "non pagato";
  public createdAt!: Date;
  public dueDate!: Date;
}

// Inizializzazione del modello Invoice
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
        model: "users", // Relazione con la tabella users
        key: "id",
      },
      onDelete: "CASCADE", // Se l'utente viene eliminato, elimina anche le sue fatture
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2), // Importo con due decimali
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pagato", "non pagato"), // Stato della fattura
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Data creazione automatica
    },
    dueDate: {
      type: DataTypes.DATE, // Scadenza pagamento
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "invoices",
    timestamps: false, // Disabilita i campi createdAt/updatedAt di default
  }
);
