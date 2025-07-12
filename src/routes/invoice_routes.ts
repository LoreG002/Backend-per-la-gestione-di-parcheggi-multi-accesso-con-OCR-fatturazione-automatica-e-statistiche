import { Router, RequestHandler } from "express";
import { Invoice } from "../models/invoice.model";
import { authenticateJWT, AuthRequest } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { Op } from "sequelize";
import { Transit } from "../models/transit.model";
import { UserVehicle } from "../models/userVehicle.model";

const router = Router();

// GET: Recupera tutte le fatture.
// Se l'utente è di ruolo "user", restituisce solo le sue fatture, altrimenti tutte.
router.get("/api/invoices", authenticateJWT, async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;

    const where: any = {};

    // Filtro per userId solo se è un utente standard (non operatore)
    if (authUser.role === "user") {
      where.userId = authUser.id;
    }

    // Trova le fatture, includendo i transiti associati (se presenti)
    const invoices = await Invoice.findAll({
      where,
      include: [
        {
          model: Transit,
          required: false,
        },
      ],
    });

    res.json(invoices);
  } catch (error) {
    console.error("Errore nella get /api/invoices:", error);
    res.status(500).json({ message: "Errore nel recupero delle fatture." });
  }
});

// GET: Stato pagamento fatture per i veicoli dell’utente (con filtri su stato, date e targa)
const getInvoiceStatus: RequestHandler = async (req, res) => {
  try {
    const authUser = (req as AuthRequest).user;
    const { status, startDate, endDate, plate } = req.query;

    // 1. Trova tutte le targhe associate all’utente
    const userVehicles = await UserVehicle.findAll({
      where: { userId: authUser.id },
    });
    const userPlates = userVehicles.map((v) => v.plate);

    // Se non ha veicoli associati, restituisce array vuoto
    if (userPlates.length === 0) {
      res.json({ invoices: [] });
      return;
    }

    // 2. Prepara il filtro per le fatture: solo quelle dell'utente
    const invoiceWhere: any = { userId: authUser.id };

    // Se viene passato un filtro di stato valido, lo aggiunge
    if (status === "pagato" || status === "non pagato") {
      invoiceWhere.status = status;
    }

    // Recupera tutte le fatture filtrate
    const invoices = await Invoice.findAll({ where: invoiceWhere });

    // 3. Per ogni fattura, cerca i transiti associati alle targhe dell'utente e ai filtri passati
    const result = [];

    for (const invoice of invoices) {
      const transitWhere: any = {
        invoiceId: invoice.id,
        plate: plate ? plate : { [Op.in]: userPlates }, // filtra per targa specifica o tutte quelle dell'utente
      };

      // Aggiunge filtro per data inizio/fine se presenti
      if (startDate || endDate) {
        transitWhere.timestamp = {};
        if (startDate) transitWhere.timestamp[Op.gte] = new Date(startDate as string);
        if (endDate) transitWhere.timestamp[Op.lte] = new Date(endDate as string);
      }

      // Cerca i transiti con i filtri specificati
      const transits = await Transit.findAll({ where: transitWhere });

      // Se ci sono transiti, aggiunge la fattura e i relativi transiti al risultato
      if (transits.length > 0) {
        result.push({
          invoiceId: invoice.id,
          amount: invoice.amount,
          status: invoice.status,
          dueDate: invoice.dueDate,
          transits,
        });
      }
    }

    // Risponde con le fatture filtrate e i loro transiti
    res.json({ invoices: result });
  } catch (error) {
    console.error("Errore in /api/invoices/status:", error);
    res.status(500).json({ message: "Errore nel recupero delle fatture." });
  }
};

router.get("/api/invoices/status/by-user", authenticateJWT, getInvoiceStatus);

// GET: Ottieni una singola fattura per ID (solo se appartiene all’utente)
router.get("/api/invoices/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user.id;

    // Cerca la fattura con id specificato e userId dell'utente loggato
    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      // Se non trovata o non appartiene all'utente, risponde con 404
      res.status(404).json({ message: "Fattura non trovata o accesso negato." });
      return;
    }

    res.json(invoice);
  } catch (error) {
    console.error("Errore nel recupero della fattura:", error);
    res.status(500).json({ message: "Errore nel recupero della fattura." });
  }
});

// PATCH: Pagamento della fattura (solo se è dell’utente)
const payInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user.id;

    // Trova la fattura che deve essere pagata e che appartiene all'utente
    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata o accesso negato." });
      return;
    }

    // Controlla che la fattura non sia già pagata
    if (invoice.status === "pagato") {
      res.status(400).json({ message: "La fattura è già stata pagata." });
      return;
    }

    // Recupera l'utente per controllare il credito disponibile
    const { User } = await import("../models/user.model");
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    const creditoDisponibile = parseFloat(user.credit.toString());
    const importoFattura = parseFloat(invoice.amount.toString());

    // Verifica se il credito è sufficiente per pagare la fattura
    if (creditoDisponibile < importoFattura) {
      res.status(400).json({
        message: "Credito insufficiente per effettuare il pagamento.",
        credit: creditoDisponibile,
        required: importoFattura,
      });
      return;
    }

    // Aggiorna lo stato della fattura a "pagato"
    invoice.status = "pagato";
    await invoice.save();

    // Aggiorna il credito dell'utente sottraendo l'importo pagato
    user.credit = creditoDisponibile - importoFattura;
    await user.save();

    res.json({
      message: "Fattura pagata con successo.",
      invoice,
      nuovoCredito: user.credit,
    });
  } catch (error) {
    console.error("Errore nel pagamento della fattura:", error);
    res.status(500).json({ message: "Errore nel pagamento della fattura." });
  }
};

router.patch("/api/invoices/:id/pay", authenticateJWT, payInvoice);

// POST: Creazione fattura (solo per operatori, ma opzionale perché generate automaticamente)
router.post(
  "/api/invoices",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { userId, amount, status, dueDate } = req.body;

      // Crea una nuova fattura con i dati forniti
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

// PUT: Aggiornamento fattura (solo operatori)
const updateInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, amount, status, dueDate } = req.body;

    // Trova la fattura da aggiornare
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    // Aggiorna i campi della fattura
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

// DELETE: Eliminazione fattura (solo operatori)
const deleteInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    // Trova la fattura da eliminare
    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
      return;
    }

    // Elimina la fattura
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

// GET: Download PDF della ricevuta di pagamento (solo utente che possiede la fattura)
import pdfkit from "pdfkit";
import { User } from "../models/user.model";

router.get("/api/invoices/:id/receipt", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).user.id;

    // Trova la fattura e controlla che appartenga all’utente
    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata o accesso negato." });
      return;
    }

    // Trova l’utente per avere i dati necessari per la ricevuta
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    // Imposta intestazione per il PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${invoice.id}.pdf`
    );

    const doc = new pdfkit();

    // Inizia a scrivere il PDF
    doc.pipe(res);

    doc.fontSize(20).text("Ricevuta di pagamento", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Fattura ID: ${invoice.id}`);
    doc.text(`Data emissione: ${invoice.createdAt}`);
    doc.text(`Data scadenza: ${invoice.dueDate}`);
    doc.text(`Importo: €${invoice.amount.toFixed(2)}`);
    doc.text(`Stato: ${invoice.status}`);

    doc.moveDown();
    doc.text("Dati utente:", { underline: true });
    doc.text(`Nome: ${user.id}`);
    doc.text(`Email: ${user.email}`);

    doc.end();
  } catch (error) {
    console.error("Errore nel download della ricevuta:", error);
    res.status(500).json({ message: "Errore nel download della ricevuta." });
  }
});

export default router;
