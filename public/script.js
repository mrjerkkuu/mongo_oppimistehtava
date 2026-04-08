async function fetchRecipes() {
  try {
    const response = await fetch('/recipes');
    const recipes = await response.json();
    const container = document.getElementById('recipe-container');
    container.innerHTML = '';

    for (const recipe of recipes) {
      // Haetaan kommentit jokaiselle reseptille
      const commRes = await fetch(`/recipes/${recipe._id}/comments`);
      const comments = await commRes.json();

      const recipeDiv = document.createElement('div');
      recipeDiv.className = 'recipe-card';

      recipeDiv.innerHTML = `
                <span class="category">${recipe.category}</span>
                <h2>${recipe.title}</h2>
                <p><strong>Aika:</strong> ${recipe.prep_time} min | <strong>Luoja:</strong> ${recipe.author_id?.username || 'Anonyymi'}</p>
                
                <span class="section-title">Ainekset:</span>
                <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join('')}</ul>
                
                <span class="section-title">Valmistus:</span>
                <ol>${recipe.instructions.map((step) => `<li>${step}</li>`).join('')}</ol>

                <div class="comments-section">
                    <span class="section-title">Kommentit:</span>
                    ${
                      comments.length > 0
                        ? comments
                            .map(
                              (c) => `
                        <div class="comment">
                            <span class="comment-author">${c.user_id?.username || 'Vierailija'}:</span>
                            "${c.text}"
                            <div class="rating">${'★'.repeat(c.rating)}${'☆'.repeat(5 - c.rating)}</div>
                        </div>
                    `,
                            )
                            .join('')
                        : '<p>Ei vielä kommentteja.</p>'
                    }
                </div>
            `;
      container.appendChild(recipeDiv);
    }
  } catch (err) {
    console.error('Virhe ladattaessa datoja:', err);
    document.getElementById('recipe-container').innerHTML =
      'Virhe datan latauksessa.';
  }
}

fetchRecipes();
