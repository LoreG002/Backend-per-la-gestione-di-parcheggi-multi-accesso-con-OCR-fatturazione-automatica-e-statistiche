import * as TransitDAO from "../dao/transit.dao";
import { checkParkingAvailability } from "../helpers/parking.helper";
import { TransitAttributes } from "../models/transit.model";
import { Invoice } from "../models/invoice.model";
import { Tariff } from "../models/tariff.model";
import { Op } from "sequelize";
import { ApiError } from "../helpers/ApiError";

// Funzione per creare un transito
export const createTransit = async (input: Omit<TransitAttributes, "id"> & { userId?: number }) => {
  const { plate, vehicleTypeId, gateId, timestamp, direction, userId } = input;

  // Se il transito è in entrata, controlla se il parcheggio è pieno
  if (direction === "entrata") {
    const available = await checkParkingAvailability(gateId);
    if (!available) throw new ApiError(400, "Parcheggio pieno. Accesso negato.");
  }

  // Crea il transito nel database
  const transit = await TransitDAO.createTransit(input);

  // Se è un'uscita e l'utente è autenticato, genera la fattura
  if (direction === "uscita" && userId) {

    // Cerca l'ultimo ingresso senza fattura associata per quella targa
    const ingresso = await TransitDAO.findLatestEntranceWithoutInvoice(plate);
    if (!ingresso) throw new ApiError(400, "Ingresso non trovato. Non posso generare la fattura.");

    // Calcola la durata della sosta in millisecondi
    const durata = new Date(timestamp).getTime() - new Date(ingresso.timestamp).getTime();
    const durataInOre = durata / (1000 * 60 * 60);

    // Determina il giorno e il tipo di giorno
    const dataUscita = new Date(timestamp);
    const giornoSettimana = dataUscita.getDay();
    const dayType = (giornoSettimana === 0 || giornoSettimana === 6) ? "festivo" : "feriale";
    const oraUscita = dataUscita.getUTCHours();

    // Cerca la tariffa corrispondente in base al tipo veicolo, giorno e fascia oraria
    const tariffa = await Tariff.findOne({
      where: {
        vehicleTypeId,
        dayType,
        startHour: { [Op.lte]: oraUscita },
        endHour: { [Op.gt]: oraUscita },
      },
    });

    if (!tariffa) throw new ApiError(400, "Nessuna tariffa trovata.");

    // Calcola il costo della sosta
    const costo = parseFloat((durataInOre * parseFloat(tariffa.pricePerHour.toString())).toFixed(2));

    // Crea la fattura nel database
    const invoice = await Invoice.create({
      userId,
      amount: costo,
      status: "non pagato",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Collega la fattura al transito di ingresso e uscita
    ingresso.invoiceId = invoice.id;
    transit.invoiceId = invoice.id;
    await ingresso.save();
    await transit.save();
  }

  return transit;
};

// Funzione per aggiornare un transito
export const updateTransit = TransitDAO.updateTransit;

// Funzione per eliminare un transito
export const deleteTransit = TransitDAO.deleteTransit;

// Funzione per ottenere tutti i transiti
export const getAllTransits = TransitDAO.getAllTransits;

// Funzione per cercare transiti in base a filtri 
export const searchTransits = TransitDAO.searchTransits;
