import request from "supertest";
import app from "../app";
import { User } from "../models/user_model";

// Mock del model User
jest.mock("../models/user_model");

const mockedUser = {
  id: 1,
  credit: 10,
  save: jest.fn(),
};

// ✅ Mock del middleware di autenticazione
jest.mock("../middlewares/auth.middleware", () => ({
  authenticateJWT: (req: any, _res: any, next: any) => {
    const authHeader = req.headers.authorization || "";
    if (authHeader.includes("operatore")) {
      req.user = { id: 2, role: "operatore" };
    } else {
      req.user = { id: 1, role: "utente" };
    }
    next();
  },
}));

// ✅ Mock del middleware di autorizzazione
jest.mock("../middlewares/role.middleware", () => ({
  authorizeRoles: (requiredRole: string) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Accesso negato. Ruolo non autorizzato." });
      }
      next();
    };
  },
}));

describe("PATCH /api/users/:id/ricarica", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dovrebbe ricaricare il credito correttamente", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue(mockedUser);

    const res = await request(app)
      .patch("/api/users/1/ricarica")
      .set("Authorization", "Bearer operatore")
      .send({ amount: 20 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Credito ricaricato con successo.");
    expect(mockedUser.credit).toBe(30);
    expect(mockedUser.save).toHaveBeenCalled();
  });

  it("dovrebbe dare errore se l'utente non esiste", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/users/999/ricarica")
      .set("Authorization", "Bearer operatore")
      .send({ amount: 10 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Utente non trovato.");
  });

  it("dovrebbe dare errore se amount è invalido", async () => {
    (User.findByPk as jest.Mock).mockResolvedValue(mockedUser);

    const res = await request(app)
      .patch("/api/users/1/ricarica")
      .set("Authorization", "Bearer operatore")
      .send({ amount: -5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Importo non valido.");
  });

  it("non dovrebbe permettere a un utente non operatore di ricaricare il credito", async () => {
    const res = await request(app)
      .patch("/api/users/1/ricarica")
      .set("Authorization", "Bearer utente") // Simula ruolo 'utente'
      .send({ amount: 10 });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Accesso negato. Ruolo non autorizzato.");
  });
});
