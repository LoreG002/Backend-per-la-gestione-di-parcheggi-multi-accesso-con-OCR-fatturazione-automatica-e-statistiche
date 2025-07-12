import request from "supertest";
import express from "express";
import invoiceRoutes from "../routes/invoice.routes";
import { Invoice } from "../models/invoice.model";

jest.mock("../models/invoice_model");

declare global {
  var mockedUser: { id: number; role: string };
}

jest.mock("../middlewares/auth.middleware", () => {
  return {
    authenticateJWT: (req: any, _res: any, next: any) => {
      req.user = globalThis.mockedUser || { id: 1, role: "user" };
      next();
    },
    authorizeRoles: (...roles: string[]) => {
      return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: "Accesso negato. Ruolo non autorizzato." });
        }
        next();
      };
    },
  };
});

// Mock dinamico per import("../models/user_model")
jest.mock("../models/user_model", () => ({
  User: {
    findByPk: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use(invoiceRoutes);

describe("Invoice API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/invoices - dovrebbe restituire una lista di fatture", async () => {
    globalThis.mockedUser = { id: 1, role: "user" };

    (Invoice.findAll as jest.Mock).mockResolvedValue([
      { id: 1, amount: 10 },
      { id: 2, amount: 20 },
    ]);

    const res = await request(app).get("/api/invoices");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("GET /api/invoices/:id - dovrebbe restituire una fattura per ID", async () => {
    globalThis.mockedUser = { id: 1, role: "user" };

    (Invoice.findOne as jest.Mock).mockResolvedValue({ id: 1, amount: 30 });

    const res = await request(app).get("/api/invoices/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ id: 1 }));
  });

  it("GET /api/invoices/:id - fattura non trovata restituisce 404", async () => {
    globalThis.mockedUser = { id: 1, role: "user" };

    (Invoice.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get("/api/invoices/999");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Fattura non trovata o accesso negato.");
  });

  it("DELETE /api/invoices/:id - dovrebbe eliminare una fattura", async () => {
    globalThis.mockedUser = { id: 1, role: "operatore" };

    const destroyMock = jest.fn();
    (Invoice.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      destroy: destroyMock,
    });

    const res = await request(app).delete("/api/invoices/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Fattura eliminata con successo.");
    expect(destroyMock).toHaveBeenCalled();
  });

  it("PATCH /api/invoices/:id/pay - dovrebbe pagare una fattura se l'utente ha credito sufficiente", async () => {
    globalThis.mockedUser = { id: 1, role: "user" };

    const saveInvoice = jest.fn();
    const saveUser = jest.fn();

    (Invoice.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      amount: 25,
      status: "non pagato",
      save: saveInvoice,
    });

    const { User } = await import("../models/user.model");
    (User.findByPk as jest.Mock).mockResolvedValue({
      id: 1,
      credit: 50,
      save: saveUser,
    });

    const res = await request(app).patch("/api/invoices/1/pay");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Fattura pagata con successo.");
    expect(saveInvoice).toHaveBeenCalled();
    expect(saveUser).toHaveBeenCalled();
    expect(res.body.nuovoCredito).toBe(25);
  });
});
