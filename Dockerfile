# Usa l'immagine base con Node
FROM node:18

# Crea una cartella dentro il container per l’app
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il codice dentro il container
COPY . .

# Espone la porta che usi in Express (es. 3000)
EXPOSE 3000

# Comando per avviare l'app
CMD ["npm", "run", "dev"]
