import * as InvoiceDAO from "../dao/invoice.dao";

// Esporta la funzione per ottenere tutte le fatture
export const getAllInvoices = InvoiceDAO.getAllInvoices;

// Esporta la funzione per ottenere lo stato delle fatture
export const getInvoiceStatus = InvoiceDAO.getInvoiceStatus;

// Esporta la funzione per pagare una fattura
export const payInvoice = InvoiceDAO.payInvoice;
