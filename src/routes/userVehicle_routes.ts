import { Router } from "express";
import { UserVehicle } from "../models/userVehicle_model";
import { authenticateJWT, AuthRequest } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// ✅ POST: Associa un veicolo a un utente (solo operatore)
router.post(
  "/api/user-vehicles",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { userId, plate, vehicleTypeId } = req.body;

      const newVehicle = await UserVehicle.create({
        userId,
        plate,
        vehicleTypeId,
      });

      res.status(201).json(newVehicle);
    } catch (error) {
      console.error("Errore nella creazione del veicolo:", error);
      res.status(500).json({ message: "Errore nella creazione del veicolo." });
    }
  }
);

// ✅ GET: Recupera tutti i veicoli dell’utente autenticato
router.get("/api/user-vehicles", authenticateJWT, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;

    const vehicles = await UserVehicle.findAll({ where: { userId } });

    res.json(vehicles);
  } catch (error) {
    console.error("Errore nel recupero dei veicoli:", error);
    res.status(500).json({ message: "Errore nel recupero dei veicoli." });
  }
});

// ✅ DELETE: Elimina un veicolo (solo operatore)
router.delete(
  "/api/user-vehicles/:id",
  authenticateJWT,
  authorizeRoles("operatore"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const vehicle = await UserVehicle.findByPk(id);
      if (!vehicle) {
        res.status(404).json({ message: "Veicolo non trovato." });
        return;
      }

      await vehicle.destroy();
      res.json({ message: "Veicolo eliminato con successo." });
    } catch (error) {
      console.error("Errore nell'eliminazione del veicolo:", error);
      res.status(500).json({ message: "Errore nell'eliminazione del veicolo." });
    }
  }
);

export default router;
