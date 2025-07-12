import { Router } from "express";
import * as InvoiceController from "../controllers/invoice.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/api/invoices", authenticateJWT, InvoiceController.getAllInvoices);

router.get("/api/invoices/status", authenticateJWT, InvoiceController.getInvoiceStatus);

router.post("/api/invoices/:id/pay", authenticateJWT, InvoiceController.payInvoice);

export default router;
