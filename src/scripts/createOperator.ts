import { sequelize } from "../database";
import { User } from "../models/user_model";
import { hashPassword } from "../helpers/auth_helper";

(async () => {
  await sequelize.authenticate();
  console.log("Connessione al DB ok!");

  const hash = await hashPassword("operatore");

  const user = await User.create({
    email: "operator@example.com",
    passwordHash: hash,
    role: "operatore",
    credit: 0,
  });

  console.log("Utente creato:", user.toJSON());

  process.exit();
})();