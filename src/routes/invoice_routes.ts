import { Router, RequestHandler } from "express";
import { Invoice } from "../models/invoice_model";

const router = Router();

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


router.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero delle fatture." });
  }
});

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


router.post("/api/invoices", async (req, res) => {
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
});

router.put("/api/invoices/:id", updateInvoice);

router.delete("/api/invoices/:id", deleteInvoice);

// ✅ PATCH: Pagamento della fattura
const payInvoice: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ message: "Fattura non trovata." });
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

router.patch("/api/invoices/:id/pay", payInvoice);


export default router;