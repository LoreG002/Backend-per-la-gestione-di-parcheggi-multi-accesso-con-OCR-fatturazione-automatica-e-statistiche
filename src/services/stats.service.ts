import { Op } from "sequelize";
import { Invoice } from "../models/invoice.model";
import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { Parking } from "../models/parking.model";


/**
 * Calcola le statistiche di fatturato (revenue) per ciascun parcheggio
 * nel periodo temporale fornito. Se viene specificato un parkingId,
 * calcola solo per quel parcheggio.
 * */

export const calculateRevenueStats = async (
  startDate: Date,
  endDate: Date,
  parkingId?: number
): Promise<{ parkingName: string; total: number }[]> => {

  // Ottiene i parcheggi da analizzare: tutti oppure uno solo in base a parkingId
  const parkings = parkingId
    ? await Parking.findAll({ where: { id: parkingId } })
    : await Parking.findAll();

  // Array che conterrà i risultati finali (nome parcheggio + totale €)
  const results: { parkingName: string; total: number }[] = [];

  // Per ogni parcheggio trovato
  for (const parking of parkings) {

    // Prende tutti i varchi associati a quel parcheggio
    const gates = await Gate.findAll({ where: { parkingId: parking.id } });
    const gateIds = gates.map((g) => g.id);

    // Prende tutti i transiti in uscita che sono avvenuti in quel periodo
    const transits = await Transit.findAll({
      where: {
        gateId: { [Op.in]: gateIds },
        direction: "uscita",
        timestamp: { [Op.between]: [startDate, endDate] },
      },
    });

    // Prende gli ID delle fatture associate ai transiti trovati
    const invoiceIds = transits.map((t) => t.invoiceId).filter((id) => id != null);

    // Prende tutte le fatture trovate per quegli ID
    const invoices = await Invoice.findAll({
      where: { id: { [Op.in]: invoiceIds } },
    });

    // Calcola il totale sommando l'importo di tutte le fatture
    const total = invoices.reduce(
      (sum, i) => sum + parseFloat(i.amount.toString()),
      0
    );

    // Aggiunge il risultato per questo parcheggio
    results.push({ parkingName: parking.name, total });
  }

  return results;
};
