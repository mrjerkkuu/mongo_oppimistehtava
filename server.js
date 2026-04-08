const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));
// Yhteysmerkkijono Dockerin MongoDB-konttiin
const mongoURI =
  'mongodb://root:password@mongo:27017/resepti_arkisto?authSource=admin';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Yhteys MongoDB:hen onnistui!'))
  .catch((err) => console.error('❌ Yhteysvirhe:', err));

// --- 1. TIETOMALLIT (Models) ---

// Käyttäjä
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  created_at: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

// Resepti
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ingredients: [String],
  instructions: [String], // Tallennettu taulukkona vaiheittain
  prep_time: Number,
  created_at: { type: Date, default: Date.now },
});
const Recipe = mongoose.model('Recipe', recipeSchema);

// Kommentti
const commentSchema = new mongoose.Schema({
  recipe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  rating: { type: Number, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
});
const Comment = mongoose.model('Comment', commentSchema);

// --- 2. API-REITIT (Routes) ---

// KÄYTTÄJÄT
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// RESEPTIT
// Hae kaikki reseptit
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author_id', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lisää uusi resepti
app.post('/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// KOMMENTIT
// Lisää kommentti reseptille
app.post('/comments', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Hae tietyn reseptin kommentit
app.get('/recipes/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ recipe_id: req.params.id }).populate(
      'user_id',
      'username',
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 API pyörii portissa ${PORT}`));
