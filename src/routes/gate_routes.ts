import { Router, RequestHandler } from "express";
import { Gate } from "../models/gate_model";
import { Parking } from "../models/parking_model";

const router = Router();

const updateGate: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, parkingId, type, direction } = req.body;

    const gate = await Gate.findByPk(id);

    if (!gate) {
      res.status(404).json({ message: "Varco non trovato." });
      return;
    }

    gate.name = name;
    gate.parkingId = parkingId;
    gate.type = type;
    gate.direction = direction;

    await gate.save();

    res.json(gate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento del varco." });
  }
};

const deleteGate: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const gate = await Gate.findByPk(id);

    if (!gate) {
      res.status(404).json({ message: "Varco non trovato." });
      return;
    }

    await gate.destroy();

    res.json({ message: "Varco eliminato con successo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione del varco." });
  }
};




router.get("/api/gates", async (req, res) => {
  try {
    const gates = await Gate.findAll({
      include: [{ model: Parking }]
    });
    res.json(gates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei varchi." });
  }
});

router.post("/api/gates", async (req, res) => {
  try {
    const { name, parkingId, type, direction } = req.body;

    const gate = await Gate.create({
      name,
      parkingId,
      type,
      direction,
    });

    res.status(201).json(gate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione del varco." });
  }
});

router.put("/api/gates/:id", updateGate);

router.delete("/api/gates/:id", deleteGate);

export default router;