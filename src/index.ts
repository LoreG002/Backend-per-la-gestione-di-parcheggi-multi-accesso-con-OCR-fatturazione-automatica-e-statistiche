import dotenv from "dotenv";
import { testConnection } from "./database";
import { Parking } from "./models/parking_model";
import parkingRoutes from "./routes/parking_routes";
import { VehicleType } from "./models/vehicleType_model";
import { Gate } from "./models/gate_model";
import { Transit } from "./models/transit_model";
import { Invoice } from "./models/invoice_model";
import { User } from "./models/user_model";
import { Tariff } from "./models/tariff_model";
import app from "./app";
import { UserVehicle } from "./models/userVehicle_model";

// Relazioni
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

dotenv.config();

const PORT = process.env.PORT;

testConnection();

(async () => {
  try {
    await Parking.sync({ alter: true });
    console.log("Tabella Parking sincronizzata");
    await VehicleType.sync({ alter: true });
    console.log("Tabella VehicleType sincronizzata!");
    await Gate.sync({ alter: true });
    console.log("Tabella Gate sincronizzata!");
    await Invoice.sync({ alter: true });
    console.log("Tabella Invoice sincronizzata!");
    await Transit.sync({ alter: true });
    console.log("Tabella Transit sincronizzata!");
    await User.sync({ alter: true });
    console.log("Tabella User sincronizzata!");
    await Tariff.sync({ alter: true });
    console.log("Tabella Tariff sincronizzata!");
    await UserVehicle.sync({ alter: true });
    console.log("Tabella UserVehicle sincronizzata!");
  } catch (error) {
    console.log("Errore nella sincro delle tabelle:", error);
  }
})();

const timestamp = "2025-07-04T11:30:00.000Z";
const date = new Date(timestamp);
const giornodellasettimana = date.getDay();
console.log("oggi è :", giornodellasettimana);

app.get("/", (req, res) => {
  res.send("Il progetto è pronto");
});

app.use(parkingRoutes);

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
