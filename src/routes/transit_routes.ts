import { Router, RequestHandler } from "express";
import { Transit } from "../models/transit_model";
import { Gate } from "../models/gate_model";
import { VehicleType } from "../models/vehicleType_model";

const router = Router();

const updateTransit: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { plate, vehicleTypeId, gateId, timestamp, direction, invoiceId } = req.body;

    const transit = await Transit.findByPk(id);

    if (!transit) {
      res.status(404).json({ message: "Transito non trovato." });
      return;
    }

    transit.plate = plate;
    transit.vehicleTypeId = vehicleTypeId;
    transit.gateId = gateId;
    transit.timestamp = timestamp;
    transit.direction = direction;
    transit.invoiceId = invoiceId;

    await transit.save();

    res.json(transit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento del transito." });
  }
};

const deleteTransit: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const transit = await Transit.findByPk(id);

    if (!transit) {
      res.status(404).json({ message: "Transito non trovato." });
      return;
    }

    await transit.destroy();

    res.json({ message: "Transito eliminato con successo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione del transito." });
  }
};


router.get("/api/transits", async (req, res) => {
  try {
    const transits = await Transit.findAll({
      include: [
        { model: Gate },
        { model: VehicleType }
      ]
    });
    res.json(transits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei transiti." });
  }
});

router.post("/api/transits", async (req, res) => {
  try {
    const { plate, vehicleTypeId, gateId, timestamp, direction, invoiceId } = req.body;

    const transit = await Transit.create({
      plate,
      vehicleTypeId,
      gateId,
      timestamp,
      direction,
      invoiceId,
    });

    res.status(201).json(transit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione del transito." });
  }
});

router.put("/api/transits/:id", updateTransit);

router.delete("/api/transits/:id", deleteTransit);

export default router;
