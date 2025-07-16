import { Router } from "express";
import { getInvoicePdf } from "../controllers/invoicePDF.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

// Rotta per generare il pdf di una fattura tramite ID
router.get("/api/invoices/:id/pdf", authenticateJWT, getInvoicePdf);

export default router;
