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
import multer from "multer";
import Tesseract from "tesseract.js";
import { Request, ParamsDictionary, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import PDFDocument from "pdfkit"




const router = Router();

const createOCR = async(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>, number>) => {
    try {
        if (!req.file) {
        res.status(400).json({ message: "Immagine Targa non trovata." });
        return;
        }
      console.log("File ricevuto:", req.file.path); 

      const result = await Tesseract.recognize(req.file.path, "eng", {
        logger: info => console.log(info)
      });

      let plateRaw = result.data.text.trim().toUpperCase();

       // Rimuove tutto ciò che NON è A-Z o 0-9
      let plate = plateRaw.replace(/[^A-Z0-9]/g, "");

      // Opzionale: Stampa debug per capire cosa hai letto
      console.log("OCR RAW:", plateRaw);
      console.log("OCR CLEAN:", plate);
    
      // ✅ Controllo disponibilità parcheggio
      const gateId = parseInt(req.body.gateId);
      const available = await checkParkingAvailability(gateId);
      if (!available) {
        res.status(403).json({ message: "Parcheggio pieno. Accesso negato." });
        return;
    }


      const transit = await Transit.create({
        plate,
        vehicleTypeId: req.body.vehicleTypeId,
        gateId: req.body.gateId,
        timestamp: new Date(),
        direction: "entrata",
        invoiceId: null
      });

      res.status(201).json({
        message: "Transito creato con OCR.",
        plate,
        transit
      });
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Errore nell'elaborazione OCR"});
    }
  };


const createTransit= async(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>, number>) => {
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post(
  "/api/transits/auto",
  authenticateJWT,
  upload.single("image"), // opzionale: viene ignorata se non serve
  async (req, res) => {
    try {
      const gateId = parseInt(req.body.gateId);
      if (!gateId || isNaN(gateId)) {
        res.status(400).json({ message: "gateId non valido" });
        return;
      }

      const gate = await Gate.findByPk(gateId);
      if (!gate) {
        res.status(404).json({ message: "Varco non trovato" });
        return;
      }

      if (gate.type === "standard") {
        return await createOCR(req, res);
      } else if (gate.type === "smart") {
        return await createTransit(req, res);
      } else {
        res.status(400).json({ message: "Tipo varco sconosciuto" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore nella gestione del varco auto." });
    }
  }
);

router.get("/api/transits/search", authenticateJWT, async (req, res) => { // /api/transits/search?plates=PA234AV&startDate=2024-01-01&endDate=2025-12-31&format=pdf
  try {
    const { plates, startDate, endDate, format } = req.query;
    const plateArray = typeof plates === "string" ? plates.split(",").map(p => p.trim().toUpperCase()) : [];

    if (!startDate || !endDate || plateArray.length === 0) {
      res.status(400).json({ message: "Inserire targhe, startDate ed endDate" });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Recupera transiti filtrati
    const whereCondition: any = {
      plate: { [Op.in]: plateArray },
      timestamp: { [Op.between]: [start, end] },
    };

    // Limitazione per utenti non admin
    const user = (req as AuthRequest).user;
    if (user.role === "user") {
      whereCondition["$Invoice.userId$"] = user.id;
    }

    const transits = await Transit.findAll({
      where: whereCondition,
      include: [Gate, VehicleType, Invoice],
      order: [["timestamp", "DESC"]],
    });

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=transits.pdf");
      doc.pipe(res);

      doc.fontSize(16).text("Report Transiti", { align: "center" }).moveDown();

      transits.forEach((t, i) => {
        doc.fontSize(12).text(`Targa: ${t.plate}`);
        doc.text(`Data: ${t.timestamp}`);
        doc.text(`Varco: ${t.gate?.id}`);
        doc.text(`Direzione: ${t.direction}`);
        doc.text(`Tipo veicolo: ${t.vehicleType?.name}`);
        doc.text(`Costo: € ${t.invoice?.amount ?? "N/A"}`);
        doc.moveDown();
        if (i < transits.length - 1) doc.moveDown();
      });

      doc.end();
    } else {
      res.json(transits);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella ricerca dei transiti" });
  }
});


export default router;
