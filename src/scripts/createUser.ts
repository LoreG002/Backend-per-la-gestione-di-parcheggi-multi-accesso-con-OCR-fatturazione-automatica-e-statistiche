import { sequelize } from "../database";
import { User } from "../models/user_model";
import { hashPassword } from "../helpers/auth_helper";

(async () => {
  await sequelize.authenticate();
  console.log("Connessione al DB ok!");

  const hash = await hashPassword("password123");

  const user = await User.create({
    email: "user@example.com",
    passwordHash: hash,
    role: "utente",
    credit: 0,
  });

  console.log("Utente creato:", user.toJSON());

  process.exit();
})();

//seed e migrations