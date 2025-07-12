import request from "supertest";
import express from "express";
import transitRoutes from "../routes/transit_routes";

import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { Tariff } from "../models/tariff.model";
import { Invoice } from "../models/invoice.model";

// Mock dei modelli e middleware
jest.mock("../models/transit_model");
jest.mock("../models/tariff_model");
jest.mock("../models/invoice_model");
jest.mock("../models/gate_model");

// Mock del middleware di autenticazione
jest.mock("../middlewares/auth.middleware", () => ({
  authenticateJWT: (req: any, _res: any, next: any) => {
    req.user = { id: 1, role: "operatore" };
    next();
  },
  AuthRequest: {}
}));

// Mock di checkParkingAvailability
jest.mock("../helpers/parking_helper", () => ({
  checkParkingAvailability: jest.fn(() => Promise.resolve(true)),
}));

// Setup app express
const app = express();
app.use(express.json());
app.use(transitRoutes);

// Mock base
jest.spyOn(Transit, "findAll").mockResolvedValue([]);

describe("Transits API", () => {
  it("GET /api/transits - dovrebbe restituire lista di transiti (vuota)", async () => {
    const res = await request(app).get("/api/transits");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /api/transits", () => {
  it("dovrebbe creare un transito manuale e restituire status 201", async () => {
    const fakeTransit = {
      id: 1,
      plate: "AB123CD",
      vehicleTypeId: 4,
      gateId: 4,
      timestamp: new Date().toISOString(),
      direction: "entrata",
      invoiceId: null,
    };

    // Mock di Transit.create e Gate.findByPk
    jest.spyOn(Transit, "create").mockResolvedValue(fakeTransit as any);
    jest.spyOn(Gate, "findByPk").mockResolvedValue({
      id: 4,
      direction: "entrata",
      parkingId: 1,
    } as any);

    const res = await request(app)
      .post("/api/transits")
      .send({
        plate: "AB123CD",
        vehicleTypeId: 4,
        gateId: 4,
        timestamp: new Date().toISOString(),
        direction: "entrata",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({
      plate: "AB123CD",
      gateId: 4,
      direction: "entrata"
    }));
  });

  it("dovrebbe creare un transito di uscita e generare fattura", async () => {
    const ingressoMock = {
      id: 99,
      plate: "ABC123",
      timestamp: new Date("2025-07-08T10:00:00.000Z"),
      direction: "entrata",
      invoiceId: null,
      save: jest.fn(),
    };

    const newTransit = {
      id: 123,
      plate: "ABC123",
      direction: "uscita",
      save: jest.fn(),
    };

    jest.spyOn(Gate, "findByPk").mockResolvedValue({
      id: 5,
      direction: "uscita",
      parkingId: 1,
    } as any);

    (Transit.findOne as jest.Mock).mockResolvedValue(ingressoMock);
    (Transit.create as jest.Mock).mockResolvedValue(newTransit);
    (Invoice.create as jest.Mock).mockResolvedValue({
      id: 1,
      amount: 2,
    });
    (Tariff.findOne as jest.Mock).mockResolvedValue({
      pricePerHour: 2,
    });

    const res = await request(app)
      .post("/api/transits")
      .send({
        plate: "ABC123",
        vehicleTypeId: 4,
        gateId: 5,
        timestamp: new Date("2025-07-08T11:00:00.000Z"),
        direction: "uscita",
      });

    expect(res.statusCode).toBe(201);
    expect(Transit.create).toHaveBeenCalled();
    expect(Invoice.create).toHaveBeenCalled();
    expect(ingressoMock.save).toHaveBeenCalled();
    expect(newTransit.save).toHaveBeenCalled();
  });
});

afterAll(() => {
  jest.resetAllMocks();
});
