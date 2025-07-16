import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { Parking } from "../models/parking.model";

// Funzione per verificare la disponibilità di posti in un parcheggio
export async function checkParkingAvailability(gateId: number): Promise<boolean> {
  // Trova il gate specificato
  const gate = await Gate.findByPk(gateId);

  // Se il gate non esiste, solleva un errore
  if (!gate) throw new Error("Gate non valido.");

  // Trova il parcheggio associato al gate
  const parking = await Parking.findByPk(gate.parkingId);

  // Se il parcheggio non esiste, solleva un errore
  if (!parking) throw new Error("Parcheggio non trovato.");

  /**
   * Recupera tutti i transiti associati a quel parcheggio,
   * includendo solo quelli legati ai suoi varchi.
   * Ordina i transiti in ordine cronologico per ricostruire l’occupazione corrente.
   */
  const transits = await Transit.findAll({
    include: {
      model: Gate,
      where: { parkingId: parking.id }
    },
    order: [["timestamp", "ASC"]]
  });

  /**
   * Simula lo stato attuale del parcheggio:
   * - Aggiunge la targa all'elenco se è entrata.
   * - La rimuove se è uscita.
   */
  const currentInside = new Set<string>();
  for (const t of transits) {
    if (t.direction === "entrata") currentInside.add(t.plate);
    else if (t.direction === "uscita") currentInside.delete(t.plate);
  }

  // Ritorna true solo se il numero di veicoli attuali è inferiore alla capacità
  return currentInside.size < parking.capacity;
}
