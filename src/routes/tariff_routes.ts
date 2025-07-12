import { Router } from "express";
import { Tariff } from "../models/tariff.model";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// 🔄 GET: tutte le tariffe (visibile anche agli utenti se necessario)
router.get("/api/tariffs", authenticateJWT, async (req, res) => {
  try {
    const tariffs = await Tariff.findAll();
    res.json(tariffs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero delle tariffe." });
  }
});

// ➕ POST: creazione tariffa (solo operatori)
router.post(
  "/api/tariffs",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { parkingId, vehicleTypeId, startHour, endHour, dayType, pricePerHour } = req.body;

      const tariff = await Tariff.create({
        parkingId,
        vehicleTypeId,
        startHour,
        endHour,
        dayType,
        pricePerHour,
      });

      res.status(201).json(tariff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore nella creazione della tariffa." });
    }
  }
);

// 📝 PUT: aggiornamento tariffa (solo operatori)
router.put(
  "/api/tariffs/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { parkingId, vehicleTypeId, startHour, endHour, dayType, pricePerHour } = req.body;

      const tariff = await Tariff.findByPk(id);

      if (!tariff) {
        res.status(404).json({ message: "Tariffa non trovata." });
        return;
      }

      tariff.parkingId = parkingId;
      tariff.vehicleTypeId = vehicleTypeId;
      tariff.startHour = startHour;
      tariff.endHour = endHour;
      tariff.dayType = dayType;
      tariff.pricePerHour = pricePerHour;

      await tariff.save();
      res.json(tariff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore nell'aggiornamento della tariffa." });
    }
  }
);

// ❌ DELETE: eliminazione tariffa (solo operatori)
router.delete(
  "/api/tariffs/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const tariff = await Tariff.findByPk(id);

      if (!tariff) {
        res.status(404).json({ message: "Tariffa non trovata." });
        return;
      }

      await tariff.destroy();
      res.json({ message: "Tariffa eliminata con successo." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore nell'eliminazione della tariffa." });
    }
  }
);

export default router;
