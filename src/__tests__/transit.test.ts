import request from "supertest";
import express from "express";
import transitRoutes from "../routes/transit_routes";

// Setup finto app Express solo per test
const app = express();
app.use(express.json());
app.use(transitRoutes);

// Mock middleware per bypassare auth
jest.mock("../middlewares/auth.middleware", () => ({
  authenticateJWT: (req: any, res: any, next: any) => {
    req.user = { id: 1, role: "operatore" };
    next();
  },
  AuthRequest: {} // per evitare errori di tipo
}));

describe("Transits API", () => {
  it("GET /api/transits - dovrebbe restituire lista di transiti (vuota)", async () => {
    const res = await request(app).get("/api/transits");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
