import { Router } from "express";
import { Parking } from "../models/parking_model";
import { RequestHandler } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";


const router = Router();

const updateParking: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, location, capacity } = req.body;

    const parking = await Parking.findByPk(id);

    if (!parking) {
      res.status(404).json({ message: "Parcheggio non trovato." });
      return;
    }

    parking.name = name;
    parking.location = location;
    parking.capacity = capacity;

    await parking.save();

    res.json(parking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'update del parcheggio" });
  }
};

const deleteParking: RequestHandler = async (req, res): Promise<void> => {
  try{
    const { id } = req.params;

    const parking = await Parking.findByPk(id);

    if(!parking){
      res.status(404).json({ message: "Parcheggio non trovato." });
      return;
    }
    await parking.destroy();

    res.json({ message: "Parcheggio eliminato con successo."});
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Errore nel delete del parcheggio"})
  }
};

router.post("/api/parkings", authenticateJWT, authorizeRoles("operatore"), async (req,res)=>{
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

router.get("/api/parkings", async (req, res) => {
  try {
    const parkings = await Parking.findAll();
    res.json(parkings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel recupero dei parcheggi." });
  }
});



router.put("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), updateParking);

router.delete("/api/parkings/:id", authenticateJWT, authorizeRoles("operatore"), deleteParking);

export default router;