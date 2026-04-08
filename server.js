const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Sallii JSON-datan lukemisen pyynnöistä

// Yhteysmerkkijono (huomioi root-tunnukset ja 'mongo' host-nimi Dockerissa)
const mongoURI =
  'mongodb://root:password@mongo:27017/resepti_arkisto?authSource=admin';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Yhteys MongoDB-tietokantaan muodostettu!'))
  .catch((err) => console.error('❌ Yhteysvirhe:', err));

// --- TIETOMALLI (Schema) ---
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  ingredients: [String], // Taulukko merkkijonoja
  instructions: [String], // Päivitetty: Taulukko merkkijonoja
  prep_time: Number,
  created_at: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// --- API-REITIT (Endpoints) ---

// 1. Hae kaikki reseptit
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Lisää uusi resepti
app.post('/recipes', async (req, res) => {
  const recipe = new Recipe({
    title: req.body.title,
    category: req.body.category,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Käynnistä palvelin
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Palvelin pyörii portissa ${PORT}`));
