import { checkParkingAvailability } from "../helpers/parking.helper";
import { Gate } from "../models/gate.model";
import { Parking } from "../models/parking.model";
import { Transit } from "../models/transit.model";

// Mocks
jest.mock("../models/gate.model");
jest.mock("../models/parking.model");
jest.mock("../models/transit.model");

describe("checkParkingAvailability", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // pulisce i mock ad ogni test
  });

  it("dovrebbe restituire true se c'è spazio disponibile per il parcheggio", async () => {
    (Gate.findByPk as jest.Mock).mockResolvedValue({ id: 1, parkingId: 100 });
    (Parking.findByPk as jest.Mock).mockResolvedValue({ id: 100, capacity: 10 });

    (Transit.findAll as jest.Mock).mockResolvedValue([
      { direction: "entrata", plate: "AAA111" },
      { direction: "entrata", plate: "BBB222" },
      { direction: "entrata", plate: "CCC333" },
      { direction: "entrata", plate: "DDD444" },
      { direction: "entrata", plate: "EEE555" },
    ]);

    const result = await checkParkingAvailability(1);
    expect(result).toBe(true);
  });

  it("dovrebbe restituire false se il parcheggio è pieno", async () => {
    (Gate.findByPk as jest.Mock).mockResolvedValue({ id: 2, parkingId: 101 });
    (Parking.findByPk as jest.Mock).mockResolvedValue({ id: 101, capacity: 3 });

    (Transit.findAll as jest.Mock).mockResolvedValue([
      { direction: "entrata", plate: "AAA111" },
      { direction: "entrata", plate: "BBB222" },
      { direction: "entrata", plate: "CCC333" },
    ]);

    const result = await checkParkingAvailability(2);
    expect(result).toBe(false);
  });

  it("dovrebbe generare un errore se il gate non viene trovato", async () => {
    (Gate.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(checkParkingAvailability(999)).rejects.toThrow("Gate non valido.");
  });

  it("dovrebbe generare un errore se il parcheggio non viene trovato", async () => {
    (Gate.findByPk as jest.Mock).mockResolvedValue({ id: 3, parkingId: 999 });
    (Parking.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(checkParkingAvailability(3)).rejects.toThrow("Parcheggio non trovato.");
  });
});
