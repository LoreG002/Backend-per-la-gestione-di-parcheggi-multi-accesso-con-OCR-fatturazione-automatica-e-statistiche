import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./database";
import { Parking } from "./models/parking_model";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

testConnection();

(async() => {
    try {
        await Parking.sync({alter: true});
        console.log("Tabella Parking Sincronizzata")
    } catch(error){
        console.log("Errore nella sincro della tabella parking:", error);
    }
})();

app.get("/", (req, res) => {
  res.send("Il progetto è pronto");
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

console.log("ciao");


