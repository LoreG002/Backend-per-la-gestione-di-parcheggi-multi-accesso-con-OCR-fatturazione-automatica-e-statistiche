import { Router } from "express";
import * as InvoiceController from "../controllers/invoice.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateDates } from "../middlewares/validateDates.middleware";

const router = Router();

// Lista tutte le fatture (utente: solo sue; operatore: tutte)
router.get("/api/invoices", authenticateJWT, InvoiceController.getAllInvoices);

// Stato delle fatture filtrate — solo utente, con validazione date
router.get("/api/invoices/status", authenticateJWT, authorizeRoles("utente"), validateDates({ fields: ["start", "end"], source: "query" }), InvoiceController.getInvoiceStatus);

// Pagamento fattura — solo utente
router.post("/api/invoices/:id/pay", authenticateJWT, authorizeRoles("utente"), InvoiceController.payInvoice);

export default router;
