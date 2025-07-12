import { sequelize } from "../database";
import { Tariff } from "../models/tariff.model";

(async () => {
  await sequelize.authenticate();
  console.log("Connessione al DB ok");

  await Tariff.bulkCreate([
    {
      vehicleTypeId: 4, // Auto feriale notturno
      startHour: 0,
      endHour: 8,
      dayType: "feriale",
      pricePerHour: 1.5,

    },
    {
      vehicleTypeId: 4, // Auto feriale giornaliero
      startHour: 8,
      endHour: 20,
      dayType: "feriale",
      pricePerHour: 2.0,

    },
    {
      vehicleTypeId: 4, // Auto festivo TUTTO IL GIORNO
      startHour: 0,
      endHour: 24,
      dayType: "festivo",
      pricePerHour: 3.0,

    },
    {
      vehicleTypeId: 3, // Moto feriale notturno
      startHour: 0,
      endHour: 8,
      dayType: "feriale",
      pricePerHour: 0.5,

    },
    {
      vehicleTypeId: 3, // Moto feriale giornaliero
      startHour: 8,
      endHour: 20,
      dayType: "feriale",
      pricePerHour: 1.0,

    },
    {
      vehicleTypeId: 3, // Moto festivo TUTTO IL GIORNO
      startHour: 0,
      endHour: 24,
      dayType: "festivo",
      pricePerHour: 1.5,

    }
  ]);

  console.log("Tariffe Inserite!");
  process.exit();
})();