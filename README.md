# 🍲 ReseptiArkisto - NoSQL-tietokantaprojekti

Tämä on koulutehtävä, jossa on toteutettu dynaaminen reseptisivusto käyttäen Full Stack -arkkitehtuuria. Projektin ytimessä on MongoDB-tietokanta, Node.js-backend ja yksinkertainen SPA-frontend (Single Page Application).

## 🚀 Ominaisuudet

- **Tietokanta:** Dokumenttipohjainen NoSQL-rakenne (MongoDB).
- **Backend:** REST API toteutettu Node.js:llä ja Expressillä.
- **Frontend:** Selkeä käyttöliittymä reseptien ja kommenttien selaamiseen.
- **Kontitus:** Koko ympäristö pystytettävissä yhdellä komennolla Dockerin avulla.
- **Testidata:** Valmista aineistoa käyttäjistä, resepteistä ja legendaarisista kommenteista (sis. Niilo22-easter egg).

---

## 🛠️ Esivaatimukset

Jotta voit ajaa projektin, tietokoneellasi tulee olla asennettuna:

- **Docker** ja **Docker Compose**
- (Valinnainen) **MongoDB Compass** tietokannan tarkasteluun ja datan tuontiin.

---

## 📦 Asennus ja pystytys

1. **Lataa projektin tiedostot** koneellesi.
2. **Käynnistä sovellus ja tietokanta:**
   Avaa terminaali projektikansiossa ja aja:
   ```bash
   docker-compose up --build
   ```
3. **Pääsy sovellukseen:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **API (Raaka JSON-data):** [http://localhost:3000/recipes](http://localhost:3000/recipes)

---

## 💾 Testidatan tuominen (MongoDB Compass)

Sovellus käynnistyy tyhjällä tietokannalla. Tuo mukana tuleva testimateriaali näin:

1. Avaa **MongoDB Compass** ja yhdistä: `mongodb://root:password@localhost:27017`.
2. Luo tietokanta nimeltä `resepti_arkisto`.
3. Luo kokoelmat (Collections): `users`, `recipes` ja `comments`.
4. Käytä **"Import Data"** -toimintoa kunkin kokoelman kohdalla ja valitse vastaava tiedosto `test-data/`-kansioista:
   - `users.json` -> `users` kokoelmaan.
   - `recipes.json` -> `recipes` kokoelmaan.
   - `comments.json` -> `comments` kokoelmaan.
5. Päivitä selain (`http://localhost:3000`), niin reseptit ilmestyvät näkyviin!

---

## 📊 Tietokantasuunnittelu

Tarkemmat tiedot tietomallista, suhteista ja suoritettavista MongoDB-kyselyistä löytyy erillisestä dokumentista:
👉 [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)

---

## 📂 Projektin rakenne

- `public/` - Frontendin HTML, CSS ja JS.
- `test-data/` - JSON-tiedostot tietokannan alustukseen.
- `server.js` - Express-palvelin ja tietokantayhteydet.
- `docker-compose.yml` - Docker-palveluiden määrittely.
- `Dockerfile` - Node.js-sovelluksen paketointiohjeet.
- `.gitignore` - Versionhallinnan ulkopuolelle jätettävät tiedostot.

---

## 📝 Tekijä

Toteutettu osana NoSQL-tietokantakurssin oppimistehtävää.
© 2026 ReseptiArkisto - Jeremia Vepsäläinen
