// Select elements
const recipeForm = document.getElementById('recipe-form');
const recipeNameInput = document.getElementById('recipe-name');
const recipeIngredientsInput = document.getElementById('recipe-ingredients');
const recipeStepsInput = document.getElementById('recipe-steps');
const recipeList = document.getElementById('recipe-list');
const searchInput = document.getElementById('search');

let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
let editIndex = null;

// Function to display recipes
function displayRecipes(filter = '') {
    recipeList.innerHTML = '';

    recipes.forEach((recipe, index) => {
        // Filter by name or ingredient
        if (
            recipe.name.toLowerCase().includes(filter.toLowerCase()) ||
            recipe.ingredients.some(ing => ing.toLowerCase().includes(filter.toLowerCase()))
        ) {
            const li = document.createElement('li');

            li.innerHTML = `
                <div class="recipe-header">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-actions">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
                <div class="recipe-details">
                    <strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}<br>
                    <strong>Steps:</strong> <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>
                </div>
            `;

            // Edit button
            li.querySelector('.edit-btn').addEventListener('click', () => {
                editIndex = index;
                recipeNameInput.value = recipe.name;
                recipeIngredientsInput.value = recipe.ingredients.join(', ');
                recipeStepsInput.value = recipe.steps.join('\n');
                recipeForm.querySelector('button').textContent = 'Update Recipe';
            });

            // Delete button
            li.querySelector('.delete-btn').addEventListener('click', () => {
                recipes.splice(index, 1);
                saveAndDisplay();
            });

            recipeList.appendChild(li);
        }
    });
}

// Function to save recipes and display
function saveAndDisplay() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes(searchInput.value);
}

// Form submit event
recipeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = recipeNameInput.value.trim();
    const ingredients = recipeIngredientsInput.value.trim().split(',').map(i => i.trim());
    const steps = recipeStepsInput.value.trim().split('\n').map(s => s.trim());

    if (!name || !ingredients.length || !steps.length) return;

    const newRecipe = { name, ingredients, steps };

    if (editIndex !== null) {
        recipes[editIndex] = newRecipe;
        editIndex = null;
        recipeForm.querySelector('button').textContent = 'Add Recipe';
    } else {
        recipes.push(newRecipe);
    }

    recipeForm.reset();
    saveAndDisplay();
});

// Search input event
searchInput.addEventListener('input', () => {
    displayRecipes(searchInput.value);
});

// Initial display
displayRecipes();
