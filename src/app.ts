import express from "express";
import dotenv from "dotenv";

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
import { ApiError } from "./helpers/ApiError";

dotenv.config();
const app = express();

app.use(express.json());

// Rotte
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

// Rotta di test base
app.get("/", (req, res) => {
  res.send("Il progetto è pronto");
});

// Middleware 404 - rotta non trovata
app.use((req, res, next) => {
  next(new ApiError(404, "Endpoint non trovato"));
});

app.use(errorHandler);

export default app;