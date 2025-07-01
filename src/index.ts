import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Ciao! Il progetto è pronto 🚀");
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});