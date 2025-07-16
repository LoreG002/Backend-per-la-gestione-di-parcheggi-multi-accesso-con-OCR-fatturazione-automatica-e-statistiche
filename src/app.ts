import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database";

import { Parking } from "./models/parking.model";
import { VehicleType } from "./models/vehicleType.model";
import { Gate } from "./models/gate.model";
import { Transit } from "./models/transit.model";
import { Invoice } from "./models/invoice.model";
import { User } from "./models/user.model";
import { Tariff } from "./models/tariff.model";
import { UserVehicle } from "./models/userVehicle.model";

import parkingRoutes from "./routes/parking.routes";
import vehicleTypeRoutes from "./routes/vehicleType.routes";
import gateRoutes from "./routes/gate.routes";
import transitRoutes from "./routes/transit.routes";
import invoiceRoutes from "./routes/invoice.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import invoicePdfRoutes from "./routes/invoicePdf.routes";
import statsroutes from "./routes/stats.routes";
import userVehicleRoutes from "./routes/userVehicle.routes";
import tariffRoutes from "./routes/tariff.routes";
import { errorHandler } from "./middlewares/error.middleware";

// Carica le variabili d’ambiente da .env
dotenv.config();

//Istanzia l'app Express
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware per interpretare richieste con JSON
app.use(express.json());

// Registrazione delle rotte
app.use(parkingRoutes);
app.use(vehicleTypeRoutes);
app.use(gateRoutes);
app.use(transitRoutes);
app.use(invoiceRoutes);
app.use(userRoutes);
app.use(authRoutes);
app.use(invoicePdfRoutes);
app.use(statsroutes);
app.use(userVehicleRoutes);
app.use(tariffRoutes);

// Rotta base per testare che il server risponde
app.get("/", (req, res) => {
  res.send("Il progetto è pronto");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint non trovato',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler middleware per gestire gli errori 
app.use(errorHandler);

// Relazioni Sequelize tra i modelli
Parking.hasMany(Gate, { foreignKey: "parkingId" });
Gate.belongsTo(Parking, { foreignKey: "parkingId" });

Gate.hasMany(Transit, { foreignKey: "gateId" });
Transit.belongsTo(Gate, { foreignKey: "gateId" });

VehicleType.hasMany(Transit, { foreignKey: "vehicleTypeId" });
Transit.belongsTo(VehicleType, { foreignKey: "vehicleTypeId" });

Invoice.hasMany(Transit, { foreignKey: "invoiceId" });
Transit.belongsTo(Invoice, { foreignKey: "invoiceId" });

User.hasMany(Invoice, { foreignKey: "userId" });
Invoice.belongsTo(User, { foreignKey: "userId" });

VehicleType.hasMany(Tariff, { foreignKey: "vehicleTypeId" });
Tariff.belongsTo(VehicleType, { foreignKey: "vehicleTypeId" });

User.hasMany(UserVehicle, { foreignKey: "userId" });
UserVehicle.belongsTo(User, { foreignKey: "userId" });

// Test connessione DB
testConnection();

// Funzione per sincronizzare i modelli con il DB
(async () => {
  try {
    await Parking.sync({ alter: true });
    console.log("Tabella Parking sincronizzata");
    await VehicleType.sync({ alter: true });
    console.log("Tabella VehicleType sincronizzata!");
    await Gate.sync({ alter: true });
    console.log("Tabella Gate sincronizzata!");
    await User.sync({ alter: true });
    console.log("Tabella User sincronizzata!");
    await Invoice.sync({ alter: true });
    console.log("Tabella Invoice sincronizzata!");
    await Transit.sync({ alter: true });
    console.log("Tabella Transit sincronizzata!");
    await Tariff.sync({ alter: true });
    console.log("Tabella Tariff sincronizzata!");
    await UserVehicle.sync({ alter: true });
    console.log("Tabella UserVehicle sincronizzata!");

    // Avvio del server Express
    app.listen(PORT, () => {
      console.log(`Server avviato sulla porta ${PORT}`);
    });
  } catch (error) {
    console.error("Errore nella sincro delle tabelle:", error);
  }
})();