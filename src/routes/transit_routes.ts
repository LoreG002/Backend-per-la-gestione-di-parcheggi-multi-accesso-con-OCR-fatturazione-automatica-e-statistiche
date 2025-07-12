import { Router, RequestHandler } from "express";
import { Transit } from "../models/transit.model";
import { Gate } from "../models/gate.model";
import { VehicleType } from "../models/vehicleType.model";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { Invoice } from "../models/invoice.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Tariff } from "../models/tariff.model";
import { Op } from "sequelize";
import { checkParkingAvailability } from "../helpers/parking.helper";
import multer from "multer";
import Tesseract from "tesseract.js";
import { Request, ParamsDictionary, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import PDFDocument from "pdfkit"
import { UserVehicle } from "../models/userVehicle.model";
import { authorizeRoles } from "../middlewares/role.middleware";

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

    const plateRaw = result.data.text.trim().toUpperCase();

    // Rimuove tutto ciò che NON è A-Z o 0-9
    const plate = plateRaw.replace(/[^A-Z0-9]/g, "");

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
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Errore nell'elaborazione OCR"});
  }
};

const createTransit = async(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,res: Response<any, Record<string, any>, number>) => {
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
      const giornoSettimana = dataUscita.getDay(); //Lunedi (1), Martedi (2)...Sabato (6), Domenica (0)
      console.log("il giorno della settimana è:" , giornoSettimana);
      const dayType = (giornoSettimana == 0 || giornoSettimana == 6) ? "festivo" : "feriale";
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

      if (!tariffa) {
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

router.get("/api/transits", authenticateJWT, async (req, res) => {
  try {
    const user = (req as AuthRequest).user;

    const whereCondition: any = {};

    if (user.role === "utente") {
      const userVehicles = await UserVehicle.findAll({ where: { userId: user.id } });
      const userPlates = userVehicles.map((v) => v.plate);

      if (userPlates.length === 0) {
        res.json([]);
        return;
      }

      whereCondition.plate = { [Op.in]: userPlates };
    }

    const transits = await Transit.findAll({
      where: whereCondition,
      include: [Gate, VehicleType, Invoice],
      order: [["timestamp", "DESC"]],
    });

    res.json(transits);
  } catch (error) {
    console.error("Errore nel recupero dei transiti:", error);
    res.status(500).json({ message: "Errore nel recupero dei transiti." });
  }
});

router.put("/api/transits/:id", authorizeRoles("operatore"), updateTransit);

router.delete("/api/transits/:id", authorizeRoles("operatore"), deleteTransit);

router.post("/api/transits", authenticateJWT, authorizeRoles("operatore"), createTransit);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post(
  "/api/transits/auto",
  authenticateJWT,
  authorizeRoles("operatore"),
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

router.post("/api/transits/search", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { plates, from, to, format } = req.body;

    if (!plates || !Array.isArray(plates) || plates.length === 0) {
      res.status(400).json({ message: "Devi specificare almeno una targa." });
      return;
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    let allowedPlates = plates;

    if (req.user.role !== "operatore") {
      const userVehicles = await UserVehicle.findAll({ where: { userId: req.user.id } });
      const userPlates = userVehicles.map(v => v.plate);
      allowedPlates = plates.filter(p => userPlates.includes(p));
    }

    if (allowedPlates.length === 0) {
      res.status(403).json({ message: "Nessuna targa autorizzata." });
      return;
    }

    const transits = await Transit.findAll({
      where: {
        plate: { [Op.in]: allowedPlates },
        timestamp: { [Op.between]: [startDate, endDate] },
      },
      include: [Gate, VehicleType, Invoice],
      order: [["timestamp", "ASC"]],
    });

    if (format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=transits.pdf");

      doc.pipe(res);
      doc.fontSize(16).text("Report Transiti", { underline: true }).moveDown();

      transits.forEach((t, i) => {
        doc.fontSize(12).text(`Targa: ${t.plate}`);
        doc.text(`Data: ${t.timestamp}`);
        doc.text(`Varco: ${t.Gate?.name ?? "N/A"}`);
        doc.text(`Direzione: ${t.direction}`);
        doc.text(`Tipo veicolo: ${t.VehicleType?.name ?? "N/A"}`);
        doc.text(`Costo: € ${t.Invoice?.amount ?? "N/A"}`);
        if (i < transits.length - 1) doc.moveDown();
        doc.moveDown();
      });

      doc.end();
    } else {
      res.json(transits);
    }
  } catch (error) {
    console.error("Errore ricerca transiti:", error);
    res.status(500).json({ message: "Errore nella ricerca transiti." });
  }
});

export default router;
