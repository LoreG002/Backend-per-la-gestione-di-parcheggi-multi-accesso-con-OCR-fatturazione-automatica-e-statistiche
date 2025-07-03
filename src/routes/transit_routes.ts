import { Router, RequestHandler } from "express";
import { Transit } from "../models/transit_model";
import { Gate } from "../models/gate_model";
import { VehicleType } from "../models/vehicleType_model";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { Invoice } from "../models/invoice_model";
import { AuthRequest } from "../middlewares/auth.middleware";

const router = Router();

const createTransit: RequestHandler = async (req, res): Promise<void> => {
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

    if (direction === "uscita") {
      const ingresso = await Transit.findOne({
        where: { plate, direction: "entrata", invoiceId: null },
        order: [["timestamp", "DESC"]],
      });

      if (!ingresso) {
        res.status(400).json({ message: "Ingresso non trovato. Non posso generare la fattura." });
        return;
      }

      const durata = new Date(timestamp).getTime() - new Date(ingresso.timestamp).getTime();
      const durataInOre = durata / (1000 * 60 * 60);

      const tariffaOraria = 2;
      const costo = parseFloat((durataInOre * tariffaOraria).toFixed(2));  //due numeri dopo la virgola

      //fattura
      const invoice = await Invoice.create({
        userId: (req as AuthRequest).user.id,
        amount: costo,
        status: "non pagato",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      
      //collego ingresso e uscita alla fattura
      ingresso.invoiceId = invoice.id;
      transit.invoiceId = invoice.id;
      await ingresso.save();
      await transit.save();
    }

    res.status(201).json(transit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione del transito." });
  }
};



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
        { model: VehicleType },
        { model: Invoice}
      ]
    });
    res.json(transits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei transiti." });
  }
});

router.put("/api/transits/:id", updateTransit);

router.delete("/api/transits/:id", deleteTransit);

router.post("/api/transits", authenticateJWT, createTransit);

export default router;
