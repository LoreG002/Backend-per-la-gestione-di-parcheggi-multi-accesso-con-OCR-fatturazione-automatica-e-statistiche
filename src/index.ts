import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database";
import { Parking } from "./models/parking_model";
import parkingRoutes from "./routes/parking_routes";
import { VehicleType } from "./models/vehicleType_model";
import vehicleTypeRoutes from "./routes/vehicleType_routes";
import { Gate } from "./models/gate_model";
import gateRoutes from "./routes/gate_routes";
import { Transit } from "./models/transit_model";
import transitRoutes from "./routes/transit_routes";
import { Invoice } from "./models/invoice_model";
import invoiceRoutes from "./routes/invoice_routes";
import { User } from "./models/user_model";
import userRoutes from "./routes/user_routes";


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

dotenv.config();

const app = express();
app.use(express.json());

app.use(parkingRoutes);
app.use(vehicleTypeRoutes);
app.use(gateRoutes);
app.use(transitRoutes);
app.use(invoiceRoutes);
app.use(userRoutes);

const PORT = process.env.PORT;

testConnection();

(async() => {
    try {
        await Parking.sync({alter: true});
        console.log("Tabella Parking Sincronizzata")
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
        
    } catch(error){
        console.log("Errore nella sincro della tabella parking:", error);
    }
})();

app.get("/", (req, res) => {
  res.send("Il progetto è pronto");
});

app.use(parkingRoutes);

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});



