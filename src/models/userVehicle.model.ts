import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database";

// Modello UserVehicle che rappresenta l'associazione tra utente e veicolo
export class UserVehicle extends Model {
  public id!: number;       // ID univoco del veicolo utente
  public userId!: number;   // ID dell'utente proprietario
  public plate!: string;    // Targa del veicolo
}

// Inizializzazione del modello Sequelize
UserVehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,   // Generazione automatica
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,      // Deve essere associato a un utente
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,          // Ogni targa può essere associata a un solo veicolo
    },
  },
  {
    sequelize,
    modelName: "UserVehicle",        // Nome del modello
    tableName: "user_vehicles",      // Nome della tabella nel DB
    timestamps: false,               // Disattiva i timestamp automatici
  }
);

