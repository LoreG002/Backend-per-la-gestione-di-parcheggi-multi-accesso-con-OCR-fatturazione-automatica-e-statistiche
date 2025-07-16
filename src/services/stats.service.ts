import { Op } from "sequelize";
import { Invoice } from "../models/invoice.model";
import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { Parking } from "../models/parking.model";

export const calculateRevenueStats = async (
  startDate: Date,
  endDate: Date,
  parkingId?: number
): Promise<{ parkingName: string; total: number }[]> => {
  const parkings = parkingId
    ? await Parking.findAll({ where: { id: parkingId } })
    : await Parking.findAll();

  const results: { parkingName: string; total: number }[] = [];

  for (const parking of parkings) {
    const gates = await Gate.findAll({ where: { parkingId: parking.id } });
    const gateIds = gates.map((g) => g.id);

    const transits = await Transit.findAll({
      where: {
        gateId: { [Op.in]: gateIds },
        direction: "uscita",
        timestamp: { [Op.between]: [startDate, endDate] },
      },
    });

    const invoiceIds = transits.map((t) => t.invoiceId).filter((id) => id != null);

    const invoices = await Invoice.findAll({
      where: { id: { [Op.in]: invoiceIds } },
    });

    const total = invoices.reduce(
      (sum, i) => sum + parseFloat(i.amount.toString()),
      0
    );

    results.push({ parkingName: parking.name, total });
  }

  return results;
};
