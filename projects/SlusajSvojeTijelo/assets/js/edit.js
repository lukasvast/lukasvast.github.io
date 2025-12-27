// Edit Recipe JavaScript
let currentRecipe = null;
let currentRecipeIndex = -1;
let allRecipes = [];

// Available options
const availableLabels = [
    { value: 'glutenfree', label: 'Gluten Free' },
    { value: 'low-foodmap', label: 'Low FODMAP' },
    { value: 'family friendly', label: 'Family Friendly' },
    { value: 'quick and easy', label: 'Quick and Easy' },
    { value: 'comfort food', label: 'Comfort Food' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' }
];

const mealTypes = [
    { value: '', label: 'Not specified' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
    { value: 'dessert', label: 'Dessert' }
];

const seasons = [
    { value: '', label: 'Not specified' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'autumn', label: 'Autumn' },
    { value: 'winter', label: 'Winter' }
];

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
    // Get recipe index from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentRecipeIndex = parseInt(urlParams.get('index'));

    if (isNaN(currentRecipeIndex) || currentRecipeIndex < 0) {
        alert('Invalid recipe index');
        goBack();
        return;
    }

    // Load recipes
    await loadRecipes();

    // Load the specific recipe
    if (currentRecipeIndex >= allRecipes.length) {
        alert('Recipe not found');
        goBack();
        return;
    }

    currentRecipe = allRecipes[currentRecipeIndex];
    populateEditForm();
});

// Load all recipes from API
async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes');
        allRecipes = await response.json();
    } catch (error) {
        console.error('Error loading recipes:', error);
        alert('Error loading recipes');
    }
}

// Populate the edit form with recipe data
function populateEditForm() {
    const editContent = document.getElementById('editContent');

    editContent.innerHTML = `
        <!-- Basic Info Section -->
        <div class="form-section">
            <h2>📝 Basic Information</h2>

            <div class="form-group">
                <label class="form-label" for="recipeName">Recipe Name</label>
                <input type="text" id="recipeName" class="form-input" value="${escapeHtml(currentRecipe.name)}" placeholder="Enter recipe name">
            </div>

            <div class="form-group">
                <label class="form-label">Rating</label>
                <div class="rating-input" id="ratingInput">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="rating-star ${(currentRecipe.rating || 0) >= star ? 'active' : ''}" onclick="setRating(${star})">★</span>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Meal Type & Season Section -->
        <div class="form-section">
            <h2>🍽️ Classification</h2>

            <div class="form-group">
                <label class="form-label" for="mealType">Meal Type</label>
                <select id="mealType" class="select-input">
                    ${mealTypes.map(type => `
                        <option value="${type.value}" ${currentRecipe.mealType === type.value ? 'selected' : ''}>
                            ${type.label}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="form-group">
                <label class="form-label" for="season">Season</label>
                <select id="season" class="select-input">
                    ${seasons.map(season => `
                        <option value="${season.value}" ${currentRecipe.season === season.value ? 'selected' : ''}>
                            ${season.label}
                        </option>
                    `).join('')}
                </select>
            </div>
        </div>

        <!-- Labels Section -->
        <div class="form-section">
            <h2>🏷️ Labels</h2>
            <div class="labels-grid">
                ${availableLabels.map(label => `
                    <div class="label-checkbox ${(currentRecipe.labels || []).includes(label.value) ? 'active' : ''}" onclick="toggleLabel('${label.value}')">
                        <input type="checkbox" value="${label.value}" ${(currentRecipe.labels || []).includes(label.value) ? 'checked' : ''}>
                        <span>${label.label}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Ingredients Section -->
        <div class="form-section">
            <h2>🥘 Ingredients</h2>
            <div id="ingredientsContainer">
                ${(currentRecipe.ingredients || []).map((ingredient, index) => `
                    <div class="ingredient-item" data-index="${index}">
                        <input type="text" class="form-input" value="${escapeHtml(ingredient)}" placeholder="Enter ingredient">
                        <button class="btn-remove" onclick="removeIngredient(${index})">✕</button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addIngredient()">+ Add Ingredient</button>
        </div>

        <!-- Instructions Section -->
        <div class="form-section">
            <h2>📖 Instructions</h2>

            <div class="editor-toolbar">
                <button class="toolbar-btn" onclick="formatText('bold')" title="Bold"><strong>B</strong></button>
                <button class="toolbar-btn" onclick="formatText('italic')" title="Italic"><em>I</em></button>
                <button class="toolbar-btn" onclick="formatText('underline')" title="Underline"><u>U</u></button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" onclick="formatText('insertOrderedList')" title="Numbered List">1.</button>
                <button class="toolbar-btn" onclick="formatText('insertUnorderedList')" title="Bullet List">•</button>
                <div class="toolbar-separator"></div>
                <button class="toolbar-btn" onclick="changeColor('#f97316')" title="Orange Color">🎨</button>
                <button class="toolbar-btn" onclick="formatText('removeFormat')" title="Clear Formatting">✕</button>
            </div>

            <div id="instructionsEditor" class="instructions-editor" contenteditable="true">
                ${currentRecipe.instructions || ''}
            </div>
        </div>
    `;
}

// Rating functions
function setRating(rating) {
    currentRecipe.rating = rating;

    // Update visual state
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Label toggle
function toggleLabel(labelValue) {
    if (!currentRecipe.labels) {
        currentRecipe.labels = [];
    }

    const index = currentRecipe.labels.indexOf(labelValue);
    if (index > -1) {
        currentRecipe.labels.splice(index, 1);
    } else {
        currentRecipe.labels.push(labelValue);
    }

    // Update visual state
    const labelCheckboxes = document.querySelectorAll('.label-checkbox');
    labelCheckboxes.forEach(checkbox => {
        const input = checkbox.querySelector('input');
        if (input.value === labelValue) {
            if (currentRecipe.labels.includes(labelValue)) {
                checkbox.classList.add('active');
                input.checked = true;
            } else {
                checkbox.classList.remove('active');
                input.checked = false;
            }
        }
    });
}

// Ingredient management
function addIngredient() {
    const container = document.getElementById('ingredientsContainer');
    const newIndex = container.children.length;

    const newIngredient = document.createElement('div');
    newIngredient.className = 'ingredient-item';
    newIngredient.dataset.index = newIndex;
    newIngredient.innerHTML = `
        <input type="text" class="form-input" value="" placeholder="Enter ingredient">
        <button class="btn-remove" onclick="removeIngredient(${newIndex})">✕</button>
    `;

    container.appendChild(newIngredient);
}

function removeIngredient(index) {
    const container = document.getElementById('ingredientsContainer');
    const items = container.querySelectorAll('.ingredient-item');

    if (items.length <= 1) {
        alert('Recipe must have at least one ingredient');
        return;
    }

    items[index].remove();

    // Re-index remaining items
    const updatedItems = container.querySelectorAll('.ingredient-item');
    updatedItems.forEach((item, idx) => {
        item.dataset.index = idx;
        const removeBtn = item.querySelector('.btn-remove');
        removeBtn.onclick = () => removeIngredient(idx);
    });
}

// Rich text editor functions
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('instructionsEditor').focus();
}

function changeColor(color) {
    document.execCommand('foreColor', false, color);
    document.getElementById('instructionsEditor').focus();
}

// Save recipe
async function saveRecipe() {
    try {
        // Gather form data
        const recipeName = document.getElementById('recipeName').value.trim();
        if (!recipeName) {
            alert('Please enter a recipe name');
            return;
        }

        // Get ingredients
        const ingredientInputs = document.querySelectorAll('#ingredientsContainer .form-input');
        const ingredients = Array.from(ingredientInputs)
            .map(input => input.value.trim())
            .filter(val => val !== '');

        if (ingredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }

        // Get instructions
        const instructions = document.getElementById('instructionsEditor').innerHTML.trim();
        if (!instructions || instructions === '<br>') {
            alert('Please add cooking instructions');
            return;
        }

        // Get other fields
        const mealType = document.getElementById('mealType').value;
        const season = document.getElementById('season').value;

        // Update current recipe
        currentRecipe.name = recipeName;
        currentRecipe.ingredients = ingredients;
        currentRecipe.instructions = instructions;
        currentRecipe.mealType = mealType;
        currentRecipe.season = season;
        // rating and labels already updated via their respective functions

        // Update in the recipes array
        allRecipes[currentRecipeIndex] = currentRecipe;

        // Save to server
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allRecipes)
        });

        if (!response.ok) {
            throw new Error('Failed to save recipe');
        }

        const result = await response.json();
        alert(result.message || 'Recipe saved successfully!');

        // Go back to main page
        goBack();
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Error saving recipe: ' + error.message);
    }
}

// Cancel edit
function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
        goBack();
    }
}

// Go back to recipe browser
function goBack() {
    window.location.href = '/';
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
