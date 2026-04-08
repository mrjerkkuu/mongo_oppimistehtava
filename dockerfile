FROM node:18

WORKDIR /usr/src/app

# Kopioidaan riippuvuudet ja asennetaan ne
COPY package*.json ./
RUN npm install

# Kopioidaan sovelluskoodi
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]