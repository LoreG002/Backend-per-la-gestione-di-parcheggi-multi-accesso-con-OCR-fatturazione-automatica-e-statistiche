import {DataTypes, Model} from "sequelize";  //model è la classe base di tutti i modelli Sequelize, Datatypes contiene i tipi STRING INTEGER..

import { sequelize } from "../database"; //importiamo la connessione

export interface ParkingAttributes {
    id?: number;    //opzionale perche viene generato dal DB
    name: string;
    location: string;
    capacity: number;
}

export class Parking extends Model <ParkingAttributes> implements ParkingAttributes {
  public id!: number;
  public name!: string;
  public location!: string;    //il ! garantisce a typescript che quegli attributi ci saranno
  public capacity!: number;
}

Parking.init(
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // connessione
    tableName: "parkings",
    timestamps: false, // non crea createdAt e updatedAt che non sono utili
  }
);
