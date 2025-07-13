import { Router } from "express";
import { getInvoicePdf } from "../controllers/invoicePDF.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/api/invoices/:id/pdf", authenticateJWT, getInvoicePdf);

export default router;
