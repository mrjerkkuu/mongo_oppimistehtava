# Tietokantasuunnitelma: Reseptisivusto

Tämä dokumentti kuvaa sovelluksen tietokantarakenteen, käytetyt teknologiat ja tyypilliset kyselyt. Sovellus hyödyntää **NoSQL-tietokantaa (MongoDB)** sen joustavuuden ja dokumenttipohjaisen rakenteen vuoksi.

## 1. Tietomalli (Schema)

Tietokanta koostuu kolmesta pääkokoelmasta: `users`, `recipes` ja `comments`.

### Kokoelma: `users`

Tallentaa sovelluksen käyttäjätiedot.

| Kenttä       | Tyyppi   | Kuvaus                           |
| :----------- | :------- | :------------------------------- |
| `_id`        | ObjectId | Uniikki tunniste (automaattinen) |
| `username`   | String   | Käyttäjänimi (uniikki)           |
| `email`      | String   | Sähköpostiosoite                 |
| `created_at` | Date     | Aikaleima tunnuksen luomisesta   |

### Kokoelma: `recipes`

Tallentaa reseptit ja niiden valmistusvaiheet.

| Kenttä         | Tyyppi         | Kuvaus                                 |
| :------------- | :------------- | :------------------------------------- |
| `_id`          | ObjectId       | Uniikki tunniste                       |
| `title`        | String         | Reseptin nimi                          |
| `category`     | String         | Kategoria (esim. Pääruoka, Jälkiruoka) |
| `author_id`    | ObjectId       | Viittaus `users`-kokoelmaan            |
| `ingredients`  | Array [String] | Lista ainesosista                      |
| `instructions` | Array [String] | Vaiheittaiset ohjeet listana           |
| `prep_time`    | Number         | Valmistusaika minuuteissa              |
| `created_at`   | Date           | Reseptin luontiajankohta               |

### Kokoelma: `comments`

Tallentaa käyttäjien jättämät arvostelut ja kommentit.

| Kenttä      | Tyyppi   | Kuvaus                        |
| :---------- | :------- | :---------------------------- |
| `_id`       | ObjectId | Uniikki tunniste              |
| `recipe_id` | ObjectId | Viittaus `recipes`-kokoelmaan |
| `user_id`   | ObjectId | Viittaus `users`-kokoelmaan   |
| `text`      | String   | Kommenttiteksti               |
| `rating`    | Number   | Arvosana (1–5)                |
| `date`      | Date     | Kommentointiajankohta         |

---

## 2. Suhteet ja suunnitteluratkaisut

- **Viittaaminen (Referencing):** Käytämme viittauksia (`author_id`, `recipe_id`), jotta data pysyy johdonmukaisena. Jos esimerkiksi käyttäjä vaihtaa nimeään, tieto päivittyy automaattisesti kaikkiin hänen resepteihinsä, koska viittaamme vain ID-tunnukseen.
- **Upottaminen (Embedding):** Ainesosat ja valmistusohjeet on tallennettu taulukkoina (`Array`) suoraan reseptin sisään. Tämä optimoi lukunopeuden: kun resepti haetaan, saadaan kaikki tarvittava sisältö yhdellä kyselyllä.
- **Vaiheistus:** Valmistusohjeet on tallennettu merkkijonotaulukkona, jotta käyttöliittymä voi renderöidä ne automaattisesti numeroituna listana.

---

## 3. Tyypilliset käyttötapaukset (Queries)

### Create (Luo)

- ### Create (Luo)

**Käyttäjä luo uuden profiilin:**

```javascript
db.users.insertOne({
  username: 'TestiKokki',
  email: 'testi@kokki.fi',
  created_at: new Date(),
});
```

**Käyttäjä tallentaa uuden reseptin ainesosineen ja vaiheineen.**

```javascript
db.recipes.insertOne({
  title: 'Pika-omeletti',
  category: 'Aamiainen',
  author_id: db.users.findOne({ username: 'TestiKokki' })._id,
  ingredients: ['2 kananmunaa', 'tilkka maitoa', 'suolaa'],
  instructions: ['Riko munat kulhoon', 'Lisää maito', 'Paista pannulla'],
  prep_time: 5,
  created_at: new Date(),
});
```

- **Käyttäjä jättää kommentin ja arvosanan reseptille.**

```javascript
db.comments.insertOne({
  recipe_id: db.recipes.findOne({ title: 'Pika-omeletti' })._id,
  user_id: db.users.findOne({ username: 'MakuMaisteri' })._id,
  text: 'Todella nopea aamupala!',
  rating: 5,
  date: new Date(),
});
```

### Read (Lue)

**Haetaan kaikki tietyn kategorian (esim. "Pääruoka") reseptit.**

```javascript
db.recipes.find({ category: 'Pääruoka' }).pretty();
```

**Haetaan tietty resepti ja siihen liittyvät kommentit `recipe_id`-kentän avulla.**

```javascript
// 1. Haetaan reseptin tiedot
db.recipes.findOne({ title: 'Lohikeitto' });

// 2. Haetaan kaikki kommentit kyseiselle reseptille
db.comments
  .find({
    recipe_id: db.recipes.findOne({ title: 'Lohikeitto' })._id,
  })
  .pretty();
```

### Update (Päivitä)

**Reseptin tietojen, kuten valmistusajan tai ohjeiden, muokkaaminen.**

```javascript
db.recipes.updateOne({ title: 'Lohikeitto' }, { $set: { prep_time: 50 } });
```

**Käyttäjän sähköpostiosoitteen päivittäminen.**

```javascript
db.users.updateOne(
  { username: 'KokkiKakkonen' },
  { $set: { email: 'uusi.osoite@esimerkki.fi' } },
);
```

### Delete (Poista)

**Reseptin poistaminen.**

```javascript
db.recipes.deleteOne({ title: 'Pika-omeletti' });
```

**Yksittäisen kommentin poistaminen.**

```javascript
// Poistetaan kommentti, jonka teksti alkaa tietyllä tavalla
db.comments.deleteOne({ text: /Todella/ });
```

---

## 4. Tekninen toteutus

- **Tietokanta:** MongoDB (pyörii Docker-kontissa)
- **Backend:** Node.js + Express
- **Kirjasto:** Mongoose (objekti-dokumentti-mallinnus eli ODM)
