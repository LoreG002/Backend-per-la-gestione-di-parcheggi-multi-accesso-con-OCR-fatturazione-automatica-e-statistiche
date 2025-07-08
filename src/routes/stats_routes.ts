import { Router } from "express";
import { Invoice } from "../models/invoice_model";
import { Transit } from "../models/transit_model";
import { Gate } from "../models/gate_model";
import { Parking } from "../models/parking_model";
import { Op, fn, col } from "sequelize";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { literal } from "sequelize";

const router = Router();

router.get("/api/stats/fatturato", authenticateJWT, async(req,res) =>{ // /api/stats/fatturato?startDate=2024-01-01&endDate=2025-12-31
    try{
        const {startDate, endDate} = req.query;

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        //console.log("data di inizio:", start, "e data di fine: ", end);

        if(!startDate || !endDate){
            res.status(400).json({ message: "Le date di inizio e di fine sono obbligatorie" });
            return;
        }

        const parkings = await Parking.findAll();

        const stats= [];

        for (const parking of parkings){

            const gates = await Gate.findAll({
                where: {parkingId: parking.id},
            });

            const gateIds= gates.map(g => g.id);

            const transits = await Transit.findAll({
                where: { 
                    gateId: {[Op.in]: gateIds}, 
                    direction: "uscita",
                    timestamp: { [Op.between]: [start, end]},
                }, 
            });

            const invoiceIds = transits.map(t => t.invoiceId).filter( id => id != null);

            const invoices = await Invoice.findAll({
                where: {id: {[Op.in]: invoiceIds}},
            });

            const fatturato= invoices.reduce(
                (acc, inv) =>  acc + parseFloat(inv.amount.toString()),
                0
            );

            stats.push({
                parkingId: parking.id,
                parkingName: parking.name,
                fatturato,
            });
        }
        
        res.json(stats);
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Errore nel calcolo del fatturato!"});
    }
});

router.get("/api/stats/parking-usage", authenticateJWT, async (req,res) =>{ // /api/stats/parking-usage?startDate=2024-01-01&endDate=2025-12-31
    try{
        const { startDate, endDate} = req.query;

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if(!startDate || !endDate ) {
            res.status(400).json({message: "Le date di inizio e di fine sono obbligatorie! "});
            return;
        }

        const parkings = await Parking.findAll();
        const stats = [];

        for (const parking of parkings) {
            const gates = await Gate.findAll({
            where: { parkingId: parking.id },
        });

        const gateIds = gates.map(g => g.id);

        const mediaOccupati = await Transit.count({
            where: {
            gateId: { [Op.in]: gateIds },
            direction: "entrata",
            timestamp: { [Op.between]: [start, end] },
            },
        });

        const postiLiberiMedi = Math.max(0, parking.capacity - mediaOccupati);

        const transitiPerVeicolo = await Transit.findAll({
            attributes: [
            "vehicleTypeId",
            [fn("COUNT", col("id")), "count"]],
            where: {
            gateId: { [Op.in]: gateIds },
            timestamp: { [Op.between]: [start, end] },
            },
            group: ["vehicleTypeId"],
        });

        stats.push({
            parkingId: parking.id,
            parkingName: parking.name,
            postiLiberiMedi,
            transitiPerVeicolo,
        });
        }

        res.json(stats);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Errore nel calcolo delle statistiche"});
    }
        
});

router.get("/api/stats/parking/:parkingId", authenticateJWT, async (req,res) => { // /api/stats/parking/2?startDate=2024-01-01&endDate=2024-12-31
    try {
        const { parkingId } = req.params;
        const { startDate, endDate } = req.query;

        const parkingIdNum = parseInt(req.params.parkingId, 10);
        console.log("ID convertito:", parkingIdNum);


        console.log("req.params:", req.params);


        console.log("l'id del parcheggio è: ",parkingIdNum, "oppure", parkingId);

        const start= new Date(startDate as string);
        const end = new Date(endDate as string);

        if (!startDate || !endDate) {
            res.status(400).json({ message: "Le date di inizio e di fine sono obbligatorie!" });
            return;
        }
        const parking = await Parking.findByPk(parkingIdNum);
        
        if (!parking) {
            res.status(404).json({ message: "Parcheggio non trovato" });
            return;
        }

        const gates = await Gate.findAll({ 
            where: { parkingId: parkingIdNum } 
        });
        const gateIds = gates.map(g => g.id);

          const transitiTotali = await Transit.count({
            where: {
                gateId: { [Op.in]: gateIds },
                timestamp: { [Op.between]: [start, end] }
            }
        }); 

        const transitiPerVeicolo = await Transit.findAll({
            attributes: [
                "vehicleTypeId",
                [fn("COUNT", col("id")), "count"]
            ],
            where: {
                gateId: { [Op.in]: gateIds },
                timestamp: { [Op.between]: [start, end] }
            },
            group: ["vehicleTypeId"]
        });

        const transitiPerFascia = await Transit.findAll({
        attributes: [
            [literal(`EXTRACT(HOUR FROM "timestamp")`), "fasciaOraria"],
            [fn("COUNT", col("id")), "count"]
        ],

        where: {
            gateId: { [Op.in]: gateIds },
            timestamp: { [Op.between]: [start, end] }
        },
        group: ["fasciaOraria"]
        });

        const transitiUscita = await Transit.findAll({
        where: {
            gateId: { [Op.in]: gateIds },
            direction: "uscita",
            timestamp: { [Op.between]: [start, end] }
        }
        });

        const invoiceIds = transitiUscita.map(t => t.invoiceId).filter(id => id != null);
        const invoices = await Invoice.findAll({
        where: { id: { [Op.in]: invoiceIds } }
        });

        const fatturato = invoices.reduce(
        (acc, inv) => acc + parseFloat(inv.amount.toString()),
        0
        );

        res.json({
        parkingId: parking.id,
        parkingName: parking.name,
        transitiTotali,
        transitiPerVeicolo,
        transitiPerFascia,
        fatturato
        });

    }catch(error) {
        console.error(error);
        res.status(500).json({message: "Errore nel calcolo delle statistiche del parcheggio "});
    }
});

export default router;