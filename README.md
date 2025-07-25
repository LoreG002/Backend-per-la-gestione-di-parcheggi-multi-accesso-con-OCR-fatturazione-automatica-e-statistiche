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
[![Docker](https://img.shields.io/badge/Made%20with-docker-%230db7ed.svg?style=plastic&logo=docker&logoColor=white)](https://www.docker.com/)

## 📌 Descrizione del progetto

Il progetto nasce come elaborato per il superamento del corso di Programmazione Avanzata (A.A. 2024/2025), e ha come obiettivo la realizzazione di un sistema back-end per la gestione di parcheggi, con particolare attenzione al controllo degli accessi, alla registrazione dei transiti dei veicoli e al calcolo automatico delle tariffe.

Nel contesto proposto, ogni parcheggio può essere dotato di più varchi di ingresso e uscita, e può accogliere veicoli di diverse tipologie, ognuna associata a un costo orario specifico. Il sistema consente di gestire in modo digitale il flusso dei veicoli: l'ingresso e l'uscita vengono registrati tramite i varchi, tenendo conto della disponibilità dei posti e della tipologia del varco, che può essere di tipo standard (con riconoscimento della targa tramite immagine OCR) o smart (con invio diretto della targa in formato JSON).

L'utente automobilista può consultare lo storico dei propri transiti, scaricare le fatture, verificare lo stato dei pagamenti e procedere al saldo delle spese tramite l'apposita interfaccia. Gli operatori hanno accesso a funzionalità avanzate, come la gestione dei parcheggi, delle tariffe, dei varchi e delle statistiche dettagliate sull'occupazione, il numero di transiti e il fatturato generato.

Il sistema è stato pensato per essere scalabile, sicuro e flessibile, integrando funzionalità di autenticazione tramite token JWT, validazione delle richieste, generazione di PDF (fatture, bollettini di pagamento con QR code, ricevute) e controllo dei permessi in base al ruolo dell'utente.

---

## 🛠️ Tecnologie utilizzate

- **Node.js** & **Express.js** – per la creazione del server RESTful.
- **TypeScript** – per tipizzazione forte e maggiore robustezza.
- **PostgreSQL** – come database relazionale.
- **Sequelize** – ORM per la gestione del database.
- **JWT (JSON Web Tokens)** – per autenticazione e gestione sessioni.
- **Jest** – per l’esecuzione di test automatici.
- **Docker** & **Docker Compose** – per ambienti di sviluppo e distribuzione coerenti.
- **Postman** – per test manuali delle API.
- **PDFKit / QR-code** – per la generazione di documenti PDF e codici QR.

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

## 📁 Struttura del progetto

```text
Backend-per-la-gestione-di-parcheggi-multi-accesso-con-OCR-fatturazione-automatica-e-statistiche/
│
├── postman/
│   └── ProgettoPA API.postman_collection.json
│
├── src/
│   ├── __tests__/                  # Test automatici con Jest
│   ├── assets/                    # Diagrammi UML (sequenze, casi d’uso, E-R)
│   ├── controllers/               # Controller REST per ogni dominio
│   ├── dao/                       # Data Access Object
│   ├── helpers/                   # Funzioni di utilità (PDF, errori, ecc.)
│   ├── middlewares/              # Middleware di autenticazione, validazione, ruoli
│   ├── models/                    # Modelli Sequelize (definizione schema DB)
│   ├── routes/                    # Definizione delle API REST
│   └── app.ts                     # Entry point principale dell’applicazione
│
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── jest.config.cjs
├── eslint.config.cjs
├── package.json
├── package-lock.json
├── README.md
```


## 🧱 Pattern Architetturali Utilizzati

Il progetto adotta un'architettura modulare ispirata al pattern **Model-View-Controller (MVC)**, opportunamente adattata al contesto di un'applicazione **interamente back-end** e **RESTful**.

### 🔄 Adattamento del pattern MVC

Nel nostro caso, la classica struttura `Model → View → Controller` è stata adattata come segue:

- **Model**  
  Contiene la definizione delle entità del dominio, realizzate tramite Sequelize. I modelli rappresentano lo schema delle tabelle del database e includono relazioni, vincoli e metadati.

- **Controller**  
  Gestisce le richieste HTTP e funge da intermediario tra il client e la logica applicativa. I controller raccolgono i dati dalle richieste, invocano i servizi appropriati e restituiscono le risposte nel formato atteso (JSON o file PDF).

- **Service (al posto della View)**  
  In assenza di un'interfaccia grafica, il layer **Service** sostituisce il ruolo tradizionale della "View". I servizi contengono la **logica applicativa pura**, come il calcolo degli importi, la gestione dei pagamenti, la logica dei transiti, ecc.  
  Questo layer favorisce la riusabilità e mantiene i controller snelli e focalizzati solo sulla gestione delle richieste.

> 📝 Questo approccio mantiene i vantaggi del pattern MVC (separazione delle responsabilità), adattandoli a un'architettura back-end moderna basata su API REST.

---
### 🔗 Chain of Responsibility (CoR)

Il progetto implementa il pattern **Chain of Responsibility** utilizzando i middleware di Express. Ogni middleware è responsabile di una specifica fase del processo di gestione delle richieste HTTP.

Questa catena consente di separare le responsabilità in modo modulare e riutilizzabile. Ad esempio:

- `auth.middleware.ts`: verifica la validità del token JWT.
- `role.middleware.ts`: controlla se il ruolo dell’utente è autorizzato all’accesso.
- `validateGateDirection.middleware.ts`: controlla la coerenza del transito in base alla direzione del varco.
- `validateDates.middleware.ts`: valida la correttezza delle date nei body delle richieste.
- `error.middleware.ts`: gestisce centralmente gli errori propagati dalla catena.

Ogni middleware può bloccare la richiesta in caso di errore, oppure passarla lungo la catena tramite `next()`, secondo il principio tipico della Chain of Responsibility.


### 🔁 Singleton

All’interno del progetto è stato adottato il **Singleton Pattern** per la gestione della connessione al database, in particolare nel file `database.ts`.

Questo pattern garantisce che **esista una sola istanza condivisa di `Sequelize`** in tutta l'applicazione, evitando la creazione di connessioni multiple e potenzialmente ridondanti. L'implementazione è resa possibile tramite:

- un **costruttore privato** nella classe `Database`, che impedisce l'istanziazione esterna;
- un metodo statico `getInstance()` che restituisce l’unica istanza creata (o la inizializza, se non ancora esistente);
- un metodo statico `testConnection()` che consente di verificare la connessione al DB.

Questa scelta promuove **efficienza, riutilizzabilità e sicurezza** nella gestione della risorsa di connessione.

📁 *File di riferimento:* `src/database.ts`

```ts
private static instance: Sequelize;

public static getInstance(): Sequelize {
  if (!Database.instance) {
    Database.instance = new Sequelize(...);
  }
  return Database.instance;
}

```


### 🗃️ DAO (Data Access Object)

Per isolare l'accesso al database, il progetto utilizza il pattern **DAO (Data Access Object)**. Ogni entità ha un modulo DAO dedicato all’interno della cartella `dao/`, responsabile delle operazioni CRUD e delle query complesse.

- Questo layer consente di:
  - Separare la logica applicativa dalla persistenza
  - Facilitare la scrittura di test automatici
  - Centralizzare e riutilizzare l’accesso ai dati

Esempi:
- `transitDao.ts` → operazioni su transiti, ingresso/uscita, calcoli permanenza
- `invoiceDao.ts` → gestione fatture, filtri per utente e stato pagamento
- `parkingDao.ts` → query su disponibilità posti, gestione parcheggi e varchi

---

### ✅ Vantaggi dell’approccio adottato

- **Separazione chiara** tra accesso ai dati, logica applicativa e gestione HTTP
- Alta **manutenibilità** e **scalabilità** del progetto
- Facilità nell’**integrazione di test** e nel debugging
- **Estendibilità**: nuovi domini si implementano creando Model + DAO + Service + Controller

Questa struttura architetturale ha guidato lo sviluppo di un'applicazione robusta, coerente e facilmente estendibile, in linea con le best practice per sistemi RESTful di media-alta complessità.

## 📡 API Endpoint – Panoramica

| Metodo | Endpoint                          | Descrizione                                              | Accesso         |
|--------|-----------------------------------|----------------------------------------------------------|-----------------|
| `POST` | `/api/login`                      | Autenticazione e ottenimento token JWT                   | chiunque |
| `GET`  | `/api/users`                      | Restituisce info utenti (per utente solo le sue)         | Utente e Operatore  |
| `GET`  | `/api/users/:id`                  | Dati di un singolo utente                                | Operatore       |
| `POST` | `/api/users`                      | Crea un nuovo utente                                     | Operatore       |
| `PUT`  | `/api/users/:id/recharge`         | Ricarica credito utente                                  | Operatore          |
| `DELETE` | `/api/users/:id`               | Elimina un utente                                        | Operatore       |
| `GET`  | `/api/transits`                   | Elenco transiti (solo propri per utenti)                 | Utente e Operatore |
| `POST` | `/api/transits/auto`              | registrare automaticamente un transito di un veicolo     | Operatore       |
| `POST` | `/api/transits/search`            | cerca e filtra i transiti dei veicoli (utente vede solo i suoi)   | Utente e Operatore  |
| `PUT`  | `/api/transits/:id`               | Aggiorna un transito                                     | Operatore       |
| `DELETE`| `/api/transits/:id`              | Elimina un transito                                      | Operatore       |
| `GET`  | `/api/invoices`                   | Visualizza le fatture     (solo propie per utente)       | Utente e Operatore |
| `GET`  | `/api/invoices/status`            | Ritorna lo status (pagato o meno)                        | Utente          |
| `POST` | `/api/invoices/:id/pay`           | Effettua il pagamento di una fattura                     | Utente          |
| `GET`  | `/api/invoices/:id/pdf`           | permette di scaricare la versione PDF di una fattura     | Utente e Operatore |
| `GET`  | `/api/stats/fatturato`            | Statistiche di fatturato                                 | Operatore       |
| `GET`  | `/api/parkings/:id/available`     | restituisce la disponibilità attuale dei posti           | Utente e Operatore |
| `POST` | `/api/parkings`                   | Crea un nuovo parcheggio                                 | Operatore       |
| `PUT`  | `/api/parkings/:id`               | Modifica un parcheggio                                   | Operatore       |
| `DELETE`| `/api/parkings/:id`              | Elimina un parcheggio                                    | Operatore       |
| `GET`  | `/api/gates`                      | Elenco varchi                                            | Operatore       |
| `GET`  | `/api/gates/:id`                  | recupera le informazioni di un varco specifico           | Utente e Operatore |
| `POST` | `/api/gates`                      | Crea un nuovo varco                                      | Operatore       |
| `PUT`  | `/api/gates/:id`                  | Modifica un varco                                        | Operatore       |
| `DELETE`| `/api/gates/:id`                 | Elimina un varco                                         | Operatore       |
| `GET`  | `/api/tariffs`                    | Elenco tariffe                                           | Utente e Operatore |
| `POST` | `/api/tariffs`                    | Crea una nuova tariffa                                   | Operatore       |
| `PUT`  | `/api/tariffs/:id`                | Modifica una tariffa                                     | Operatore       |
| `DELETE`| `/api/tariffs/:id`               | Elimina una tariffa                                      | Operatore       |
| `GET`  | `/api/vehicle-types`              | Tipologie di veicolo disponibili                         | Utente e Operatore  |
| `PUT`  | `/api/vehicle-types/:id`          | Modifica una tipologia di veicolo                        | Operatore       |
| `DELETE`| `/api/vehicle-types/:id`         | Elimina una tipologia di veicolo                         | Operatore       |
| `GET`  | `/api/user-vehicles`              | Elenco veicoli associati (solo i proprio per l'utente)   | Utente e Operatore |
| `POST` | `/api/user-vehicles`              | Associa un veicolo a un utente                           | Operatore          |
| `DELETE`| `/api/user-vehicles/:id`         | Rimuove un veicolo dell’utente                           | Operatore       |

---


## 📚 Diagrammi UML 

## 🗃️ Schema ER (Entità-Relazioni)
   
   ![Schema ER](src/assets/Schema%20ER.png)

### ✅ Diagrammi dei Casi d'Uso

-
  ![Actors](src/assets/Actors.drawio.png)

- 
  ![Use Case Login](src/assets/Login.drawio.png)

- 
  ![Use Case Utente](src/assets/Use%20Case%20Utente.drawio.png)

- 
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

## 🧪 Esempio di utilizzo: OCR tramite `POST /api/transits/auto`

Il sistema consente di registrare automaticamente un transito (entrata o uscita) attraverso l’analisi OCR della targa.

### 📤 Endpoint
- **Metodo:** `POST`
- **Percorso:** `/api/transits/auto`
- **Autenticazione:** authorizeRoles("operatore")
- **Content-Type:** `multipart/form-data`

### 📝 Parametri nel body (form-data)

| Chiave           | Tipo     | Descrizione                                 |
|------------------|----------|----------------------------------------------|
| `image`          | File     | Immagine contenente la targa del veicolo     |
| `gateId`         | Integer  | ID del varco                                 |
| `vehicleTypeId`  | Integer  | ID del tipo di veicolo                       |

---

### ▶️ Esempio di richiesta (Postman)

Nella seguente schermata si vede un esempio reale di invocazione da Postman fatta dall'Operatore.

📤 **Richiesta:**

![Richiesta](./src/assets/test1.png)

📸 **Immagine della targa inviata:**

![Targa](./src/assets/test2.png)

---

### ✅ Esempio di risposta

Il backend  registra un nuovo transito, restituendo i dati principali dell’evento:

📥 **Risposta:**

![Risposta](./src/assets/test3.png)

In questo esempio, la targa `CZ889KF` è stata riconosciuta correttamente e viene registrato un transito di **entrata** con `invoiceId: null`, in quanto non è ancora associata una fattura.

## 🚀 Come avviare il progetto

Per eseguire il progetto in locale è necessario avere installati Docker e Docker Compose.

1. Clonare il repository:

   ```bash
   git clone https://github.com/LoreG002/Backend-per-la-gestione-di-parcheggi-multi-accesso-con-OCR-fatturazione-automatica-e-statistiche.git
   cd Backend-per-la-gestione-di-parcheggi-multi-accesso-con-OCR-fatturazione-automatica-e-statistiche

2. Creare un file .env nella root del progetto con le seguenti variabili di ambiente:
  
   ```bash
   PORT=
   JWT_SECRET=
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   ```
   Bisogna compilare tutti i campi con i valori appropriati per il proprio ambiente di sviluppo.

3. Avviare l’ambiente con Docker:

  ```bash
  docker-compose up --build
  ```

---
 
## 🌱 Popolamento del database (Seed)
 
Per testare il sistema con dati già pronti, è disponibile uno script `seed.ts` che crea:
 
- Utenti demo (`utente@demo.com` e `operatore@demo.com`)
- Parcheggi e varchi associati
- Tipologie di veicoli e tariffe
- Veicoli utenti, transiti e relative fatture
 
### ▶️ Esecuzione del seed
 
Per eseguire lo script:
 
1. Assicurati che il database sia accessibile (es. con `docker-compose up`)
2. Esegui il seed con il comando:
 
```bash
npx ts-node src/seed.ts

```

## 👥 Autori

- Lorenzo Giannetti
- Niccolò Balloni
- Francesco Concetti




