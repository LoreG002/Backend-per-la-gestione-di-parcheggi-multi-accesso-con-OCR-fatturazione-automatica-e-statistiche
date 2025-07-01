import express from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Ciao! Il progetto è pronto 🚀");
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});