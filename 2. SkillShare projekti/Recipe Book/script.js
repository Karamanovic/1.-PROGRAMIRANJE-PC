const API_KEY = "92f0263949a74da9877e2fb48b92fbf9";
const recipeListEl = document.getElementById("recipe-list");

function displayRecipes(recipes) {
  recipeListEl.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeItemEl = document.createElement("li");
    recipeItemEl.classList.add("recipe-item");
    recipeImageEl = document.createElement("img");
    recipeImageEl.src = recipe.image;
    recipeImageEl.alt = "recipe image";

    recipeTitleEl = document.createElement("h2");
    recipeTitleEl.innerText = recipe.title;

    recipeIngredientsEl = document.createElement("p");
    recipeIngredientsEl.innerHTML = `
        <strong>Ingredients:</strong> ${recipe.extendedIngredients
          .map((ingredient) => ingredient.original)
          .join(", ")}
    `;

    recipeLinkEl = document.createElement("a");
    recipeLinkEl.href = recipe.sourceUrl;
    recipeLinkEl.innerText = "View Recipe";

    recipeItemEl.appendChild(recipeImageEl);
    recipeItemEl.appendChild(recipeTitleEl);
    recipeItemEl.appendChild(recipeIngredientsEl);
    recipeItemEl.appendChild(recipeLinkEl);
    recipeListEl.appendChild(recipeItemEl);
  });
}

async function getRecipes() {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/random?number=6&apiKey=${API_KEY}`
  );

  const data = await response.json();

  return data.recipes;
}

async function init() {
  const recipes = await getRecipes();
  displayRecipes(recipes);
}
// Show/hide the arrow-up button based on scroll position
window.addEventListener('scroll', function () {
  const arrowUp = document.getElementById('arrow-up');
  if (window.scrollY > 100) {
    arrowUp.classList.add('show'); // Add class to make it visible
  } else {
    arrowUp.classList.remove('show'); // Remove class to hide it
  }
});

// Show/hide the arrow-up button based on scroll position
window.addEventListener('scroll', function () {
  const arrowUp = document.getElementById('arrow-up');
  if (window.scrollY > 100) {
    arrowUp.classList.add('show'); // Add class to make it visible
  } else {
    arrowUp.classList.remove('show'); // Remove class to hide it
  }
});

 // Scroll to the top function
 function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

init();