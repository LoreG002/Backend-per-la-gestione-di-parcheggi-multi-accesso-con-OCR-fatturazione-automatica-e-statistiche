import { Router, RequestHandler } from "express";
import { User } from "../models/user_model";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

const updateUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, passwordHash, role, credit } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "Utente non trovato." });
      return;
    }

    user.email = email;
    user.passwordHash = passwordHash;
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

router.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero degli utenti." });
  }
});

router.post("/api/users", async (req, res) => {
  try {
    const { email, passwordHash, role, credit } = req.body;

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

router.put("/api/users/:id", updateUser);

router.delete("/api/users/:id", deleteUser);

router.get("/api/protected", authenticateJWT, (req, res) => { //richiede il token e mostra i dati decodificati
  res.json({
    message: "Accesso autorizzato!",
    user: (req as any).user
  });
});

export default router;

