import { Router } from "express";
import * as InvoiceController from "../controllers/invoice.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validateDates } from "../middlewares/validateDates.middleware";

const router = Router();

// Ottieni tutte le fatture visibili in base all'utente autenticato
router.get("/api/invoices", authenticateJWT, InvoiceController.getAllInvoices);

// Ottieni lo stato di tutte le fatture (Accessibile solo agli utenti con ruolo "utente")
router.get("/api/invoices/status", authenticateJWT, InvoiceController.getInvoiceStatus);

// Effettua il pagamento della fattura con ID specifico (Accessibile solo agli utenti con ruolo "utente")
router.post("/api/invoices/:id/pay", authenticateJWT, authorizeRoles("utente"), InvoiceController.payInvoice);

export default router;
