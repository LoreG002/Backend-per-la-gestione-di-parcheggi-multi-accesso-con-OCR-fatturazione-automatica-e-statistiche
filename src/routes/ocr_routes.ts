import { RequestHandler, Router } from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import { Transit } from "../models/transit_model";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

const createOCR: RequestHandler = async(req,res): Promise<void> => {
    try {
        if (!req.file) {
        res.status(400).json({ message: "Nessun file inviato." });
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


// Configurazione Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // cartella dove salvare i file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post(
    "/api/ocr/transits",
    authenticateJWT,
    upload.single("image"),
    createOCR)
export default router;

