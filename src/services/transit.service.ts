import * as TransitDAO from "../dao/transit.dao";
import { checkParkingAvailability } from "../helpers/parking.helper";
import { TransitAttributes } from "../models/transit.model";
import { Invoice } from "../models/invoice.model";
import { Tariff } from "../models/tariff.model";
import { Op } from "sequelize";

export const createTransit = async (input: Omit<TransitAttributes, "id"> & { userId?: number }) => {
  const { plate, vehicleTypeId, gateId, timestamp, direction, userId } = input;

  if (direction === "entrata") {
    const available = await checkParkingAvailability(gateId);
    if (!available) throw new Error("Parcheggio pieno. Accesso negato.");
  }

  const transit = await TransitDAO.createTransit(input);

  if (direction === "uscita" && userId) {
    const ingresso = await TransitDAO.findLatestEntranceWithoutInvoice(plate);
    if (!ingresso) throw new Error("Ingresso non trovato. Non posso generare la fattura.");

    const durata = new Date(timestamp).getTime() - new Date(ingresso.timestamp).getTime();
    const durataInOre = durata / (1000 * 60 * 60);

    const dataUscita = new Date(timestamp);
    const giornoSettimana = dataUscita.getDay();
    const dayType = (giornoSettimana === 0 || giornoSettimana === 6) ? "festivo" : "feriale";
    const oraUscita = dataUscita.getUTCHours();

    const tariffa = await Tariff.findOne({
      where: {
        vehicleTypeId,
        dayType,
        startHour: { [Op.lte]: oraUscita },
        endHour: { [Op.gt]: oraUscita },
      },
    });

    if (!tariffa) throw new Error("Nessuna tariffa trovata.");

    const costo = parseFloat((durataInOre * parseFloat(tariffa.pricePerHour.toString())).toFixed(2));

    const invoice = await Invoice.create({
      userId,
      amount: costo,
      status: "non pagato",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    ingresso.invoiceId = invoice.id;
    transit.invoiceId = invoice.id;
    await ingresso.save();
    await transit.save();
  }

  return transit;
};

export const updateTransit = TransitDAO.updateTransit;
export const deleteTransit = TransitDAO.deleteTransit;
export const getAllTransits = TransitDAO.getAllTransits;
export const searchTransits = TransitDAO.searchTransits;
