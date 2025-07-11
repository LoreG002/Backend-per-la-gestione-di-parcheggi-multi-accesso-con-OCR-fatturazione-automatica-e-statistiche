import { Router, RequestHandler } from "express";
import { User } from "../models/user_model";
import { authenticateJWT, AuthRequest } from "../middlewares/auth.middleware";
import * as bcrypt from "bcrypt";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

const updateUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, password, role, credit } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    user.email = email;
    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }
    user.role = role;
    user.credit = credit;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento dell'utente." });
  }
};

const deleteUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    await user.destroy();

    res.json({ message: "Utente eliminato con successo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione dell'utente." });
  }
};

router.get("/api/users", authenticateJWT, authorizeRoles("operatore"), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero degli utenti." });
  }
});

router.post("/api/users", authenticateJWT, authorizeRoles("operatore"), async (req, res) => {
  try {
    const { email, password, role, credit } = req.body;

    // hash per la paswword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,  //dopo usiamo bcrypt per salvarlo come hash reale
      role,
      credit,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nella creazione dell'utente." });
  }
});

router.put("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), updateUser);

router.delete("/api/users/:id", authenticateJWT, authorizeRoles("operatore"), deleteUser);

router.get("/api/protected", authenticateJWT, (req, res) => { //richiede il token e mostra i dati decodificati
  res.json({
    message: "Accesso autorizzato!",
    user: (req as any).user
  });
});

// ✅ PATCH: Ricarica credito utente (solo operatore)
const ricaricaCredito: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const importo = parseFloat(amount); // nel caso arrivi come stringa

    if (isNaN(importo) || importo <= 0) {
      res.status(400).json({ message: "Importo non valido." });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    user.credit = parseFloat(user.credit.toString()) + importo;
    await user.save();

    res.json({
      message: "Credito ricaricato con successo.",
      credit: user.credit,
      userId: user.id,
    });
  } catch (error) {
    console.error("Errore nella ricarica del credito:", error);
    res.status(500).json({ message: "Errore durante la ricarica del credito." });
  }
};

router.patch(
  "/api/users/:id/ricarica",
  authenticateJWT,
  authorizeRoles("operatore"),
  ricaricaCredito
);

router.get("/api/users/me", authenticateJWT, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error);
    res.status(500).json({ message: "Errore nel recupero dei dati utente." });
  }
});

export default router;
