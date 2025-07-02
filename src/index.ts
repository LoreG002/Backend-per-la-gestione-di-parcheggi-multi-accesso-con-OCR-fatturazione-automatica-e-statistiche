import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database";
import { Parking } from "./models/parking_model";
import parkingRoutes from "./routes/parking_routes";
import { VehicleType } from "./models/vehicleType_model";
import vehicleTypeRoutes from "./routes/vehicleType_routes";
import { Gate } from "./models/gate_model";
import gateRoutes from "./routes/gate_routes";

// Relazioni
Parking.hasMany(Gate, { foreignKey: "parkingId" });
Gate.belongsTo(Parking, { foreignKey: "parkingId" });

dotenv.config();

const app = express();
app.use(express.json());

app.use(parkingRoutes);
app.use(vehicleTypeRoutes);
app.use(gateRoutes);

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



