<div align="center">
  <img src="https://i.imgur.com/oPvGIh9.jpeg" alt="Illustrazione Parcheggio" width="400"/>
</div>

# 🚗 Sviluppo Back-End per un Sistema di Controllo Accessi e Gestione Parcheggi

[![Postgres](https://img.shields.io/badge/Made%20with-postgres-%23316192.svg?style=plastic&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NodeJS](https://img.shields.io/badge/Made%20with-node.js-6DA55F?style=plastic&logo=node.js&logoColor=white)](https://nodejs.org/en)
[![Sequelize](https://img.shields.io/badge/Made%20with-Sequelize-52B0E7?style=plastic&logo=Sequelize&logoColor=white)](https://sequelize.org/)
[![Express.js](https://img.shields.io/badge/Made%20with-express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB)](https://expressjs.com/it/)
[![JWT](https://img.shields.io/badge/Made%20with-JWT-black?style=plastic&logo=JSON%20web%20tokens)](https://jwt.io/)
[![TypeScript](https://img.shields.io/badge/Made%20with-typescript-%23007ACC.svg?style=plastic&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Postman](https://img.shields.io/badge/Made%20with-Postman-FF6C37?style=plastic&logo=postman&logoColor=white)](https://www.postman.com/)

## 📌 Descrizione del progetto

Il progetto nasce come elaborato per il superamento del corso di Programmazione Avanzata (A.A. 2024/2025), e ha come obiettivo la realizzazione di un sistema back-end per la gestione di parcheggi , con particolare attenzione al controllo degli accessi, alla registrazione dei transiti dei veicoli e al calcolo automatico delle tariffe.

Nel contesto proposto, ogni parcheggio può essere dotato di più varchi di ingresso e uscita, e può accogliere veicoli di diverse tipologie, ognuna associata a un costo orario specifico. Il sistema consente di gestire in modo digitale il flusso dei veicoli: l'ingresso e l'uscita vengono registrati tramite i varchi, tenendo conto della disponibilità dei posti e della tipologia del varco, che può essere di tipo standard (con riconoscimento della targa tramite immagine OCR) o smart (con invio diretto della targa in formato JSON).

L’utente automobilista può consultare lo storico dei propri transiti, scaricare le fatture, verificare lo stato dei pagamenti e procedere al saldo delle spese tramite l’apposita interfaccia. Gli operatori hanno accesso a funzionalità avanzate, come la gestione dei parcheggi, delle tariffe, dei varchi e delle statistiche dettagliate sull’occupazione, il numero di transiti e il fatturato generato.

Il sistema è stato pensato per essere scalabile, sicuro e flessibile, integrando funzionalità di autenticazione tramite token JWT, validazione delle richieste, generazione di PDF (fatture, bollettini di pagamento con QR code, ricevute) e controllo dei permessi in base al ruolo dell’utente.
---

## 🛠️ Tecnologie utilizzate

- 

---

## 📄 Specifiche e requisiti funzionali

Il sistema deve garantire le seguenti funzionalità:

- **Gestione parcheggi e varchi**  
  - Creazione, lettura, aggiornamento e cancellazione (CRUD) di parcheggi e varchi associati.  
  - I varchi possono essere di tipo standard (upload immagine targa) o smart (invio JSON con targa).  
  - I varchi possono essere bi-direzionali.

- **Gestione tariffe**  
  - CRUD delle tariffe di parcheggio, con differenziazione per tipo di veicolo, fascia oraria e giorno (festivo/feriale).

- **Gestione transiti**  
  - Inserimento transiti (ingresso e uscita) con data/ora, targa e varco specifico.  
  - Rifiuto inserimento se il parcheggio non ha posti disponibili.  
  - Calcolo automatico del costo del parcheggio in base alla permanenza e alle tariffe.  
  - Generazione automatica della fattura associata all’utente all’atto dell’uscita.

- **Consultazione transiti e fatture**  
  - Visualizzazione stato transiti per una o più targhe in un intervallo temporale, con output in JSON o PDF.  
  - Accesso limitato: gli utenti vedono solo i propri veicoli, gli operatori vedono tutti.

- **Statistiche e report**  
  - Rotte per ottenere statistiche aggregate su fatturato, posti liberi medi, transiti distinti per fascia oraria e tipologia veicolo, filtrabili per periodo.  
  - Output disponibile in JSON o PDF.

- **Gestione pagamenti**  
  - Verifica stato pagamento fatture per utente, con filtri per stato pagamento, data ingresso e uscita.  
  - Generazione PDF di bollettini di pagamento con QR code identificativo.  
  - Possibilità per l’utente di pagare il bollettino.  
  - Gli operatori possono ricaricare il credito degli utenti.  
  - Scaricamento ricevute di pagamento in PDF.

- **Sicurezza e autenticazione**  
  - Tutte le rotte sono protette con autenticazione JWT.  
  - Gestione ruoli e permessi (utente, operatore).  
  - Validazione delle richieste e gestione centralizzata degli errori tramite middleware.

- **Altri requisiti**  
  - Implementazione in TypeScript.  
  - Persistenza dati tramite database relazionale interfacciato con Sequelize (DB a scelta del gruppo).  
  - Avvio del progetto tramite `docker-compose`.  
  - Almeno 4 test automatici con Jest.

---

## 📚 Diagrammi UML 

### ✅ Diagrammi dei Casi d'Uso
- Actors :
  ![Actors](src/assets/Actors.drawio.png)

- Login :
  ![Use Case Login](src/assets/Login.drawio.png)

- Utente :
  ![Use Case Utente](src/assets/Use%20Case%20Utente.drawio.png)

- Operatore:
  ![Use Case Operatore](src/assets/Use%20Case%20Operatore.drawio.png)

---

### 📈 Diagrammi delle Sequenze principali

| Endpoint | Immagine |
|---------|----------|
| Login | ![Login](src/assets/LogIn.png) |
| GET /api/invoices | ![Get.Invoice](src/assets/Get.Api.Invoice.png) |
| GET /api/invoices/:id/pdf | ![Get.Invoice.PDF](src/assets/Get.api.invoices.id.pdf.png) |
| POST /api/invoices/:id/pay | ![Pay.Invoice](src/assets/POST.api.invoice.id.pay.png) |
| GET /api/gates | ![Get.Gates](src/assets/Get.api.gates.png) |
| PUT /api/gates/:id | ![Put.Gates](src/assets/PUT.api.gates.id.png) |
| POST /api/parkings | ![Post.Parkings](src/assets/POST.api.parkings.png) |
| GET /api/parkings/:id/available | ![Available.Parkings](src/assets/get.api.parkings.id.available.png) |
| POST /api/tariffs | ![Post.Tariffs](src/assets/POST.api.tariffs.png) |
| POST /api/transit/search | ![Search.Transit](src/assets/POST.api.transit.search.png) |
| POST /api/transits/auto | ![Auto.Transit](src/assets/POST.api.transits.auto.png) |
| GET /api/vehicle-types | ![Vehicle.Types](src/assets/GET.api.vehicle-types.png) |
| PUT /api/vehicle-types/:id | ![Put.Vehicle.Types](src/assets/PUT.api.vehicle-types.id.png) |
| POST /api/users | ![Post.Users](src/assets/POST.api.users.png) |
| PUT /api/users/:id | ![Put.Users](src/assets/PUT.api.users.id.png) |
| POST /api/user-vehicles | ![User.Vehicles](src/assets/POST.api.user-vehicles.png) |
| GET /api/stats/fatturato | ![Stats.Fatturato](src/assets/Get.api.stats.fatturato.png) |

---

## 📁 Struttura del progetto

*(Questa sezione sarà completata in seguito)*

---



## 👥 Autori

- Lorenzo Giannetti
- Niccolò Balloni
- Francesco Concetti



