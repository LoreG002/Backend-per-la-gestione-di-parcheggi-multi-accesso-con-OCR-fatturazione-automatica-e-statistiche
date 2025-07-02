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

app.post("/api/parkings", async (req,res)=>{
    console.log("Richiesta POST ricevuta:", req.body);

    try{
      const {name, location, capacity} = req.body;

      const parking = await Parking.create({ //await attende che viene risolta la promise
        name,
        location,
        capacity,
      });
      res.status(201).json(parking);
    } catch(error){
      console.error(error);
      res.status(500).json({message: "Errore nella creazione del parcheggio"});
    }

});

app.get("/api/parkings", async (req, res) => {
  try {
    const parkings = await Parking.findAll();
    res.json(parkings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei parcheggi." });
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});

console.log("ciao");


