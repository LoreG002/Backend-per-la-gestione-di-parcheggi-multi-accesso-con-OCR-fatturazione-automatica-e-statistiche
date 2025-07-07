import { Transit } from "../models/transit_model";
import { Gate } from "../models/gate_model";
import { Parking } from "../models/parking_model";

export async function checkParkingAvailability(gateId: number): Promise<boolean> {
  const gate = await Gate.findByPk(gateId);
  if (!gate) throw new Error("Gate non valido.");

  const parking = await Parking.findByPk(gate.parkingId);
  if (!parking) throw new Error("Parcheggio non trovato.");

  const transits = await Transit.findAll({
    include: {
      model: Gate,
      where: { parkingId: parking.id }
    },
    order: [["timestamp", "ASC"]]
  });

  let currentInside = new Set<string>();
  for (const t of transits) {
    if (t.direction === "entrata") currentInside.add(t.plate);
    else if (t.direction === "uscita") currentInside.delete(t.plate);
  }

  return currentInside.size < parking.capacity;
}
