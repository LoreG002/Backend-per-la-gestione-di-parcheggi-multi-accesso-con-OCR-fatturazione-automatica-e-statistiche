import { sequelize } from "../database";
import { User } from "../models/user.model";
import { Parking } from "../models/parking.model";
import { Gate } from "../models/gate.model";
import { VehicleType } from "../models/vehicleType.model";
import { Tariff } from "../models/tariff.model";
import { UserVehicle } from "../models/userVehicle.model";
import { Transit } from "../models/transit.model";
import { Invoice } from "../models/invoice.model";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("🔁 Resetting database...");
    await sequelize.sync({ force: true });

    // 1. Utenti
    const passwordHash = await bcrypt.hash("password", 10);
    const utente = await User.create({
      email: "utente@demo.com",
      passwordHash,
      role: "utente",
      credit: 50,
    });
    const operatore = await User.create({
      email: "operatore@demo.com",
      passwordHash,
      role: "operatore",
      credit: 0,
    });

    // 2. Parcheggi
    const centro = await Parking.create({
      name: "Centro",
      capacity: 100,
      location: "Via Roma, 1",
    });
    const stazione = await Parking.create({
      name: "Stazione",
      capacity: 80,
      location: "Piazza Stazione, 2",
    });

    // 3. Varchi
    const gates = await Gate.bulkCreate([
      { name: "Centro Ingresso", parkingId: centro.id, type: "standard", direction: "entrata" },
      { name: "Centro Uscita", parkingId: centro.id, type: "standard", direction: "uscita" },
      { name: "Stazione Ingresso/Uscita", parkingId: stazione.id, type: "smart", direction: "bidirezionale" },
    ]);

    // 4. Tipi veicoli
    const [auto, moto] = await VehicleType.bulkCreate([
      { name: "auto" },
      { name: "moto" },
    ]);

    // 5. Tariffe
    await Tariff.bulkCreate([
      { parkingId: centro.id, vehicleTypeId: auto.id, dayType: "feriale", startHour: 0, endHour: 24, pricePerHour: 2.0 },
      { parkingId: centro.id, vehicleTypeId: auto.id, dayType: "festivo", startHour: 0, endHour: 24, pricePerHour: 2.5 },
      { parkingId: centro.id, vehicleTypeId: moto.id, dayType: "feriale", startHour: 0, endHour: 24, pricePerHour: 1.0 },
      { parkingId: centro.id, vehicleTypeId: moto.id, dayType: "festivo", startHour: 0, endHour: 24, pricePerHour: 1.5 },
      { parkingId: stazione.id, vehicleTypeId: auto.id, dayType: "feriale", startHour: 0, endHour: 24, pricePerHour: 1.8 },
      { parkingId: stazione.id, vehicleTypeId: auto.id, dayType: "festivo", startHour: 0, endHour: 24, pricePerHour: 2.2 },
      { parkingId: stazione.id, vehicleTypeId: moto.id, dayType: "feriale", startHour: 0, endHour: 24, pricePerHour: 0.9 },
      { parkingId: stazione.id, vehicleTypeId: moto.id, dayType: "festivo", startHour: 0, endHour: 24, pricePerHour: 1.3 },
    ]);

    // 6. Primo utente: veicolo, transiti e fattura
    await UserVehicle.create({
      userId: utente.id,
      plate: "AB123CD",
      vehicleTypeId: auto.id,
    });

    const ingresso = await Transit.create({
      plate: "AB123CD",
      vehicleTypeId: auto.id,
      gateId: gates[0].id,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 ore fa
      direction: "entrata",
      invoiceId: null,
    });

    const invoice = await Invoice.create({
      userId: utente.id,
      amount: 4.0,
      status: "non pagato",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await Transit.create({
      plate: "AB123CD",
      vehicleTypeId: auto.id,
      gateId: gates[1].id,
      timestamp: new Date(),
      direction: "uscita",
      invoiceId: invoice.id,
    });

    ingresso.invoiceId = invoice.id;
    await ingresso.save();

    // 7. Secondo utente: veicolo, transiti e fattura
    const secondoUtente = await User.create({
      email: "secondo@demo.com",
      passwordHash,
      role: "utente",
      credit: 100,
    });

    await UserVehicle.create({
      userId: secondoUtente.id,
      plate: "EF456GH",
      vehicleTypeId: auto.id,
    });

    const ingresso2 = await Transit.create({
      plate: "EF456GH",
      vehicleTypeId: auto.id,
      gateId: gates[2].id, // bidirezionale
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 ore fa
      direction: "entrata",
      invoiceId: null,
    });

    const invoice2 = await Invoice.create({
      userId: secondoUtente.id,
      amount: 5.4,
      status: "non pagato",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await Transit.create({
      plate: "EF456GH",
      vehicleTypeId: auto.id,
      gateId: gates[2].id, // stesso gate
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 ora fa
      direction: "uscita",
      invoiceId: invoice2.id,
    });

    ingresso2.invoiceId = invoice2.id;
    await ingresso2.save();

    console.log("✅ Seed completato con successo.");
  } catch (err) {
    console.error("❌ Errore durante il seed:", err);
  } finally {
    await sequelize.close();
  }
}

seed();
