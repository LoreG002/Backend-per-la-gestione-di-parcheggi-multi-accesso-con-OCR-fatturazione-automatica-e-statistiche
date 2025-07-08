import { Router, RequestHandler } from "express";
import { Invoice } from "../models/invoice_model";
import { authenticateJWT, AuthRequest } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.get("/api/invoices", authenticateJWT, async (req, res) => {
  try {
    const user = (req as AuthRequest).user;

    let invoices;

    if (user.role === "operatore") {
      // Operatore può vedere tutte le fatture
      invoices = await Invoice.findAll();
    } else {
      // Utente vede solo le sue
      invoices = await Invoice.findAll({ where: { userId: user.id } });
    }

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero delle fatture." });
  }
});


// ✅ GET: Ottieni una singola fattura per ID (solo se appartiene all’utente)
router.get("/api/invoices/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user.id;

    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata o accesso negato." });
      return;
    }

    res.json(invoice);
  } catch (error) {
    console.error("Errore nel recupero della fattura:", error);
    res.status(500).json({ message: "Errore nel recupero della fattura." });
  }
});

// ✅ PATCH: Pagamento della fattura (solo se è dell’utente)
const payInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user.id;

    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata o accesso negato." });
      return;
    }

    if (invoice.status === "pagato") {
      res.status(400).json({ message: "La fattura è già stata pagata." });
      return;
    }

    invoice.status = "pagato";
    await invoice.save();

    res.json({ message: "Fattura pagata con successo.", invoice });
  } catch (error) {
    console.error("Errore nel pagamento della fattura:", error);
    res.status(500).json({ message: "Errore nel pagamento della fattura." });
  }
};

router.patch("/api/invoices/:id/pay", authenticateJWT, payInvoice);

// ✅ POST: Creazione fattura (solo per operatori, ma opzionale perché generate automaticamente)
router.post(
  "/api/invoices",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { userId, amount, status, dueDate } = req.body;

      const invoice = await Invoice.create({
        userId,
        amount,
        status,
        dueDate,
      });

      res.status(201).json(invoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore nella creazione della fattura." });
    }
  }
);

// ✅ PUT: Aggiornamento fattura (solo operatori)
const updateInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, amount, status, dueDate } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    invoice.userId = userId;
    invoice.amount = amount;
    invoice.status = status;
    invoice.dueDate = dueDate;

    await invoice.save();

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento della fattura." });
  }
};

router.put(
  "/api/invoices/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  updateInvoice
);

// ✅ DELETE: Eliminazione fattura (solo operatori)
const deleteInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    await invoice.destroy();

    res.json({ message: "Fattura eliminata con successo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione della fattura." });
  }
};

router.delete(
  "/api/invoices/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  deleteInvoice
);

export default router;
