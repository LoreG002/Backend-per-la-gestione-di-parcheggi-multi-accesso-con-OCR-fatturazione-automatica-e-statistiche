import { Router, RequestHandler } from "express";
import { Transit } from "../models/transit_model";
import { Gate } from "../models/gate_model";
import { VehicleType } from "../models/vehicleType_model";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { Invoice } from "../models/invoice_model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { where } from "sequelize";
import { Tariff } from "../models/tariff_model";
import { Op } from "sequelize";
import { checkParkingAvailability } from "../helpers/parking_helper";


const router = Router();

const createTransit: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { plate, vehicleTypeId, gateId, timestamp, direction, invoiceId } = req.body;

        // ✅ Controllo disponibilità SOLO per entrata
    if (direction === "entrata") {
      const available = await checkParkingAvailability(gateId);
      if (!available) {
        res.status(400).json({ message: "Parcheggio pieno. Accesso negato." });
        return;
      }
    }
    
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

      const dataUscita = new Date (timestamp);
      const giornoSettimana= dataUscita.getDay(); //Lunedi (1), Martedi (2)...Sabato (6), Domenica (0)
      console.log("il giorno della settimana è:" , giornoSettimana);
      const dayType = (giornoSettimana==0 || giornoSettimana == 6) ? "festivo" : "feriale";
      console.log("e quindi è: ", dayType);

      const oraUscita = dataUscita.getUTCHours();
      console.log("ora uscita: ", oraUscita);

      const tariffa = await Tariff.findOne({
        where:{
          vehicleTypeId,
          dayType,
          startHour: {[Op.lte]: oraUscita},   //cerca dove startHour è minore o uguale dell'ora di uscita
          endHour: {[Op.gt]: oraUscita}       //cerca dove endHour è maggiore dell'ora di uscita

        }
      });

      if(!tariffa){
        res.status(400).json({ message: "Nessuna tariffa trovata"});
        return;
      }
      
      //const tariffaOraria = 2;
      const costo = parseFloat((durataInOre * parseFloat(tariffa.pricePerHour.toString())).toFixed(2));  //due numeri dopo la virgola

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
