import { Router, RequestHandler } from "express";
import { Gate } from "../models/gate.model";
import { Parking } from "../models/parking.model";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

/**
 * Handler per aggiornare un varco (gate) esistente.
 * Riceve l'id del varco da modificare tramite URL params e i nuovi dati nel body.
 * Se il varco non esiste risponde con errore 404.
 * Altrimenti aggiorna il varco e restituisce l'oggetto aggiornato.
 */
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

/**
 * Handler per eliminare un varco dato il suo id.
 * Se il varco non esiste risponde con 404.
 * Altrimenti lo elimina dal database e conferma l'eliminazione.
 */
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

/**
 * Route GET per ottenere tutti i varchi.
 * Include anche i dati relativi al parcheggio associato.
 */
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

/**
 * Route POST per creare un nuovo varco.
 * Richiede autenticazione e che l'utente abbia il ruolo "operatore".
 * Riceve i dati del varco nel body e crea un nuovo record.
 */
router.post("/api/gates", authenticateJWT, authorizeRoles("operatore"), async (req, res) => {
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

// Route PUT per aggiornare un varco esistente (autenticazione e ruolo "operatore" richiesti)
router.put("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), updateGate);

// Route DELETE per eliminare un varco (autenticazione e ruolo "operatore" richiesti)
router.delete("/api/gates/:id", authenticateJWT, authorizeRoles("operatore"), deleteGate);

export default router;
