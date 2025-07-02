import { Router, RequestHandler } from "express";
import { VehicleType } from "../models/vehicleType_model";

const router = Router();

const updateVehicleType: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const type = await VehicleType.findByPk(id);

    if (!type) {
      res.status(404).json({ message: "Tipo di veicolo non trovato." });
      return;
    }

    type.name = name;
    type.description = description;

    await type.save();

    res.json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento del tipo di veicolo." });
  }
};

const deleteVehicleType: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const type = await VehicleType.findByPk(id);

    if (!type) {
      res.status(404).json({ message: "Tipo di veicolo non trovato." });
      return;
    }

    await type.destroy();

    res.json({ message: "Tipo di veicolo eliminato con successo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione del tipo di veicolo." });
  }
};

router.get("/api/vehicle-types", async (req, res) => {
  try {
    const types = await VehicleType.findAll();
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei tipi di veicolo." });
  }
});

router.post("/api/vehicle-types", async (req, res) => {
  try {
    const { name, description } = req.body;

    const type = await VehicleType.create({
      name,
      description,
    });

    res.status(201).json(type);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione del tipo di veicolo." });
  }
});

router.put("/api/vehicle-types/:id", updateVehicleType);

router.delete("/api/vehicle-types/:id", deleteVehicleType);

export default router;