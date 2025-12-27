// State Management
let recipes = [];
let currentRecipeIndex = null;
let isEditing = false;
let filteredRecipes = [];
let availableLabels = [
    'glutenfree',
    'family friendly',
    'quick and easy',
    'low-foodmap'
];

// Exclusive label groups - recipe can only have one from each group
let exclusiveLabelGroups = {
    'Meal Type': ['breakfast', 'lunch', 'snack', 'dessert'],
    'Season': ['spring', 'summer', 'autumn', 'winter']
};

// Label icons and colors
const labelConfig = {
    'glutenfree': { icon: '🌾', color: '#f97316' },
    'family friendly': { icon: '👨‍👩‍👧‍👦', color: '#fb923c' },
    'quick and easy': { icon: '⚡', color: '#fdba74' },
    'low-foodmap': { icon: '💚', color: '#10b981' },
    'breakfast': { icon: '🌅', color: '#fb923c' },
    'lunch': { icon: '🍽️', color: '#f97316' },
    'snack': { icon: '🍪', color: '#fdba74' },
    'dessert': { icon: '🍰', color: '#fbbf24' },
    'spring': { icon: '🌸', color: '#10b981' },
    'summer': { icon: '☀️', color: '#fbbf24' },
    'autumn': { icon: '🍂', color: '#ea580c' },
    'winter': { icon: '❄️', color: '#3b82f6' }
};

function getLabelConfig(label) {
    return labelConfig[label] || { icon: '🏷️', color: '#f97316' };
}

let activeFilters = {
    labels: [],
    minRating: 0
};

// ============================================================================
// API & Data Loading
// ============================================================================

// Load recipes from server API
async function loadRecipes() {
    try {
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to load recipes');
        recipes = await response.json();

        // Extract all unique labels from recipes (labels field only contains regular labels now)
        recipes.forEach(recipe => {
            if (recipe.labels) {
                recipe.labels.forEach(label => {
                    if (!availableLabels.includes(label)) {
                        availableLabels.push(label);
                    }
                });
            }
        });

        filteredRecipes = [...recipes];
        updateRecipeList();
        updateRecipeCount();
        updateFilterLabels();
        updateRatingFilterDisplay();
    } catch (error) {
        document.getElementById('recipeList').innerHTML =
            '<div class="no-recipes">Error loading recipes.<br>Check if the server is running.</div>';
        console.error('Error loading recipes:', error);
    }
}

// ============================================================================
// Recipe List & Display
// ============================================================================

// Update recipe list in sidebar
function updateRecipeList() {
    const listElement = document.getElementById('recipeList');
    listElement.innerHTML = '';

    filteredRecipes.forEach((recipe, index) => {
        const li = document.createElement('li');
        li.className = 'recipe-item';
        li.textContent = recipe.name;
        li.onclick = () => showRecipe(recipes.indexOf(recipe));
        listElement.appendChild(li);
    });

    if (filteredRecipes.length === 0) {
        listElement.innerHTML = '<div class="no-recipes">No results</div>';
    }
}

// Update recipe count
function updateRecipeCount() {
    const countElement = document.getElementById('recipeCount');
    countElement.textContent = `${filteredRecipes.length} of ${recipes.length} recipes`;
}

// Show recipe details
function showRecipe(index) {
    if (isEditing) {
        if (!confirm('You have unsaved changes. Do you want to continue?')) {
            return;
        }
        cancelEdit();
    }

    currentRecipeIndex = index;
    const recipe = recipes[index];

    // Highlight active recipe
    document.querySelectorAll('.recipe-item').forEach((item, i) => {
        if (recipes.indexOf(filteredRecipes[i]) === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Render recipe
    const mainContent = document.getElementById('mainContent');
    const rating = recipe.rating || 0;
    const ratingText = rating > 0 ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'Not rated';
    const labels = recipe.labels || [];

    mainContent.innerHTML = `
        <div class="active-filters-bar" id="activeFiltersBar">
            <span class="active-filters-label">Active filters:</span>
            <div id="activeFilterTags"></div>
        </div>
        <div class="recipe-header">
            <div style="flex: 1;">
                <h2 class="recipe-title" id="recipeTitle">${recipe.name}</h2>
                <div class="rating-container">
                    <div class="stars" id="starsDisplay">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <span class="star ${star <= rating ? 'filled' : ''}" data-rating="${star}" onclick="rateRecipe(${star})">★</span>
                        `).join('')}
                    </div>
                    <span class="rating-text">${ratingText}</span>
                </div>
                ${labels.length > 0 ? `
                    <div class="labels-container">
                        ${labels.map(label => {
                            const config = getLabelConfig(label);
                            return `<span class="label" style="color: ${config.color}; border-color: ${config.color};">${config.icon} ${label}</span>`;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="action-buttons">
                <button class="btn btn-edit" onclick="startEdit()">✏️ Edit</button>
                <button class="btn btn-export" onclick="exportRecipe()">💾 Export</button>
            </div>
        </div>

        <div class="recipe-section">
            <h3>📝 Ingredients</h3>
            <ul class="ingredients-list" id="ingredientsList">
                ${recipe.ingredients.map((ing, i) => `
                    <li class="ingredient-item" data-index="${i}">${ing}</li>
                `).join('')}
            </ul>
        </div>

        <div class="recipe-section">
            <h3>👨‍🍳 Instructions</h3>
            <div class="instructions" id="instructions">${recipe.instructions}</div>
        </div>
    `;

    // Update active filters bar
    updateActiveFiltersBar();

    // Add hover effect for stars
    addStarHoverEffect();
}

// ============================================================================
// Filtering
// ============================================================================

// Apply all filters
function applyFilters() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();

    filteredRecipes = recipes.filter(recipe => {
        // Search filter
        if (searchTerm && !recipe.name.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Filter by labels, mealType, and season
        if (activeFilters.labels.length > 0) {
            const mealTypes = exclusiveLabelGroups['Meal Type'];
            const seasons = exclusiveLabelGroups['Season'];

            for (const filterLabel of activeFilters.labels) {
                if (mealTypes.includes(filterLabel)) {
                    // Check mealType field
                    if (recipe.mealType !== filterLabel) return false;
                } else if (seasons.includes(filterLabel)) {
                    // Check season field
                    if (recipe.season !== filterLabel) return false;
                } else {
                    // Check labels array
                    const recipeLabels = recipe.labels || [];
                    if (!recipeLabels.includes(filterLabel)) return false;
                }
            }
        }

        // Rating filter
        if (activeFilters.minRating > 0) {
            const rating = recipe.rating || 0;
            if (rating < activeFilters.minRating) return false;
        }

        return true;
    });

    // Sort by rating (highest first)
    filteredRecipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    updateRecipeList();
    updateRecipeCount();
    updateActiveFiltersBar();
}

// Update the active filters bar
function updateActiveFiltersBar() {
    const bar = document.getElementById('activeFiltersBar');
    const tagsContainer = document.getElementById('activeFilterTags');

    if (!bar || !tagsContainer) return;

    const hasActiveFilters = activeFilters.labels.length > 0 || activeFilters.minRating > 0;

    if (hasActiveFilters) {
        bar.classList.add('visible');

        let tagsHtml = '';

        // Add label filter tags
        activeFilters.labels.forEach(label => {
            const config = getLabelConfig(label);
            tagsHtml += `
                <span class="active-filter-tag" onclick="toggleLabelFilter('${label}')">
                    ${config.icon} ${label}
                    <span class="remove-icon">×</span>
                </span>
            `;
        });

        // Add rating filter tag
        if (activeFilters.minRating > 0) {
            tagsHtml += `
                <span class="active-rating-tag" onclick="toggleRatingFilter(${activeFilters.minRating})">
                    ⭐ ${activeFilters.minRating}+ stars
                    <span class="remove-icon">×</span>
                </span>
            `;
        }

        tagsContainer.innerHTML = tagsHtml;
    } else {
        bar.classList.remove('visible');
    }
}

function toggleFilterSection(titleElement) {
    titleElement.classList.toggle('collapsed');
    const section = titleElement.parentElement;
    const content = section.querySelector('.filter-labels, .rating-filter');
    if (content) {
        content.classList.toggle('collapsed');
    }
}

// Filter functions
function updateFilterLabels() {
    const filterLabelsEl = document.getElementById('filterLabels');

    let html = '';

    // Regular labels
    if (availableLabels.length > 0) {
        html += availableLabels.map(label => {
            const config = getLabelConfig(label);
            const isActive = activeFilters.labels.includes(label);
            return `
                <span class="filter-label ${isActive ? 'active' : ''}"
                      onclick="event.stopPropagation(); toggleLabelFilter('${label}');"
                      style="${!isActive ? `border-color: ${config.color};` : ''}">
                    ${config.icon} ${label}
                </span>
            `;
        }).join('');
    }

    filterLabelsEl.innerHTML = html;

    // Add exclusive label groups
    const filtersContainer = document.getElementById('filters');
    const existingSections = filtersContainer.querySelectorAll('.filter-section');

    // Save the collapsed state of each section before rebuilding
    const collapsedStates = {};
    existingSections.forEach((section, index) => {
        if (index >= 2) {
            const titleEl = section.querySelector('.filter-title');
            const titleText = titleEl ? titleEl.querySelector('span').textContent : null;
            if (titleText) {
                collapsedStates[titleText] = titleEl.classList.contains('collapsed');
            }
            section.remove();
        }
    });

    // Add exclusive label group sections
    Object.entries(exclusiveLabelGroups).forEach(([groupName, groupLabels]) => {
        // Check if this section was previously expanded (not collapsed)
        const isCollapsed = collapsedStates[groupName] !== false; // Default to collapsed if not found

        const section = document.createElement('div');
        section.className = 'filter-section';
        section.innerHTML = `
            <div class="filter-title ${isCollapsed ? 'collapsed' : ''}" onclick="toggleFilterSection(this)">
                <span>${groupName}</span>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="filter-labels ${isCollapsed ? 'collapsed' : ''}">
                ${groupLabels.map(label => {
                    const config = getLabelConfig(label);
                    const isActive = activeFilters.labels.includes(label);
                    return `
                        <span class="filter-label ${isActive ? 'active' : ''}"
                              onclick="event.stopPropagation(); toggleLabelFilter('${label}');"
                              style="${!isActive ? `border-color: ${config.color};` : ''}">
                            ${config.icon} ${label}
                        </span>
                    `;
                }).join('')}
            </div>
        `;
        // Insert before clear filters button
        const clearFiltersEl = filtersContainer.querySelector('.clear-filters');
        filtersContainer.insertBefore(section, clearFiltersEl);
    });
}

function toggleLabelFilter(label) {
    const mealTypes = exclusiveLabelGroups['Meal Type'];
    const seasons = exclusiveLabelGroups['Season'];

    // Check if this is an exclusive label (meal type or season)
    const isMealType = mealTypes.includes(label);
    const isSeason = seasons.includes(label);

    if (isMealType || isSeason) {
        // Single-select behavior for exclusive labels
        const exclusiveLabels = isMealType ? mealTypes : seasons;

        // Remove all labels from this exclusive group
        activeFilters.labels = activeFilters.labels.filter(l => !exclusiveLabels.includes(l));

        // Toggle the clicked label
        const index = activeFilters.labels.indexOf(label);
        if (index === -1) {
            activeFilters.labels.push(label);
        }
    } else {
        // Multi-select behavior for regular labels
        const index = activeFilters.labels.indexOf(label);
        if (index > -1) {
            activeFilters.labels.splice(index, 1);
        } else {
            activeFilters.labels.push(label);
        }
    }

    updateFilterLabels();
    applyFilters();
}

function filterByRating(rating) {
    activeFilters.minRating = rating;
    updateRatingFilterDisplay();
    applyFilters();
}

function toggleRatingFilter(rating) {
    if (activeFilters.minRating === rating) {
        activeFilters.minRating = 0;
    } else {
        activeFilters.minRating = rating;
    }
    updateRatingFilterDisplay();
    applyFilters();
}

function updateRatingFilterDisplay() {
    const stars = document.querySelectorAll('#ratingFilter .star');
    stars.forEach((star, index) => {
        const starRating = index + 1;
        if (starRating <= activeFilters.minRating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

function clearFilters() {
    activeFilters.labels = [];
    activeFilters.minRating = 0;
    document.getElementById('searchBox').value = '';
    updateFilterLabels();
    updateRatingFilterDisplay();
    applyFilters();
}

// ============================================================================
// Editing Mode
// ============================================================================

// Start editing mode
function startEdit() {
    if (currentRecipeIndex === null) return;

    isEditing = true;
    const recipe = recipes[currentRecipeIndex];
    const recipeLabels = recipe.labels || [];

    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="recipe-header">
            <input type="text" class="recipe-title editing" id="recipeTitle" value="${recipe.name}">
            <div class="action-buttons">
                <button class="btn btn-save" onclick="saveEdit()">✓ Save</button>
                <button class="btn btn-cancel" onclick="cancelEdit()">✗ Cancel</button>
            </div>
        </div>

        <div class="recipe-section">
            <h3>🏷️ Labels</h3>
            <div class="labels-container" id="labelsEdit">
                ${recipeLabels.map(label => {
                    const config = getLabelConfig(label);
                    return `
                        <span class="label editing" style="color: ${config.color}; border-color: ${config.color};">
                            ${config.icon} ${label}
                            <span class="label-remove" onclick="removeLabelByName('${label}')">✗</span>
                        </span>
                    `;
                }).join('')}
            </div>

            <div style="margin-top: 15px;">
                <button class="btn-add" onclick="toggleLabelSelector()" style="width: 100%;">
                    ➕ Add/Change Labels
                </button>

                <div id="labelSelectorPanel" style="display: none; margin-top: 15px; padding: 15px; background: #fff7ed; border-radius: 8px; border: 2px solid #fed7aa;">
                    ${availableLabels.length > 0 ? `
                        <div style="margin-bottom: 10px;">
                            <label style="font-size: 15px; font-weight: 600; color: #f97316; display: block; margin-bottom: 8px;">Regular Labels</label>
                            <select id="labelSelect" onchange="addLabelToRecipe(this.value)" style="width: 100%; padding: 12px; border: 2px solid #fed7aa; border-radius: 8px; font-size: 16px;">
                                <option value="">+ Add label</option>
                                ${availableLabels.filter(l => !recipeLabels.includes(l)).map(label => {
                                    const config = getLabelConfig(label);
                                    return `<option value="${label}">${config.icon} ${label}</option>`;
                                }).join('')}
                            </select>
                        </div>
                    ` : ''}

                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 15px; font-weight: 600; color: #f97316; display: block; margin-bottom: 8px;">Meal Type</label>
                        <select id="mealTypeSelect" onchange="updateMealType(this.value)" style="width: 100%; padding: 12px; border: 2px solid #fed7aa; border-radius: 8px; font-size: 16px;">
                            <option value="">None</option>
                            ${exclusiveLabelGroups['Meal Type'].map(label => {
                                const config = getLabelConfig(label);
                                return `<option value="${label}" ${recipe.mealType === label ? 'selected' : ''}>${config.icon} ${label}</option>`;
                            }).join('')}
                        </select>
                    </div>

                    <div style="margin-bottom: 10px;">
                        <label style="font-size: 15px; font-weight: 600; color: #f97316; display: block; margin-bottom: 8px;">Season</label>
                        <select id="seasonSelect" onchange="updateSeason(this.value)" style="width: 100%; padding: 12px; border: 2px solid #fed7aa; border-radius: 8px; font-size: 16px;">
                            <option value="">None</option>
                            ${exclusiveLabelGroups['Season'].map(label => {
                                const config = getLabelConfig(label);
                                return `<option value="${label}" ${recipe.season === label ? 'selected' : ''}>${config.icon} ${label}</option>`;
                            }).join('')}
                        </select>
                    </div>

                    <button class="btn" style="width: 100%; background: #9ca3af; margin-top: 10px;" onclick="toggleLabelSelector()">
                        ✓ Done
                    </button>
                </div>
            </div>
        </div>

        <div class="recipe-section">
            <h3>📝 Ingredients</h3>
            <ul class="ingredients-list" id="ingredientsList">
                ${recipe.ingredients.map((ing, i) => `
                    <li class="ingredient-item editing">
                        <input type="text" value="${ing}" data-index="${i}">
                        <button class="btn-delete" onclick="deleteIngredient(${i})">✗</button>
                    </li>
                `).join('')}
            </ul>
            <button class="btn btn-add" onclick="addIngredient()">+ Add ingredient</button>
        </div>

        <div class="recipe-section">
            <h3>👨‍🍳 Instructions</h3>

            <!-- Rich text editor toolbar -->
            <div class="editor-toolbar">
                <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="Bold (Ctrl+B)">
                    <strong>B</strong>
                </button>
                <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="Italic (Ctrl+I)">
                    <em>I</em>
                </button>
                <span class="toolbar-separator"></span>
                <button type="button" class="toolbar-btn" onclick="formatText('insertOrderedList')" title="Numbered List">
                    ≡
                </button>
                <button type="button" class="toolbar-btn" onclick="formatText('insertUnorderedList')" title="Bulleted List">
                    •
                </button>
                <span class="toolbar-separator"></span>
                <button type="button" class="toolbar-btn" onclick="clearFormatting()" title="Clear Formatting">
                    ✕
                </button>
            </div>

            <div class="instructions editing"
                 id="instructionsEditor"
                 contenteditable="true"
                 style="min-height: 250px; max-height: 500px; overflow-y: auto; cursor: text;">${recipe.instructions}</div>
        </div>
    `;
}

// Save edits
async function saveEdit() {
    if (currentRecipeIndex === null) return;

    const recipe = recipes[currentRecipeIndex];

    // Update name
    recipe.name = document.getElementById('recipeTitle').value;

    // Update ingredients
    const ingredientInputs = document.querySelectorAll('#ingredientsList input');
    recipe.ingredients = Array.from(ingredientInputs).map(input => input.value).filter(v => v.trim());

    // Update instructions from rich text editor
    const instructionsEditor = document.getElementById('instructionsEditor');
    recipe.instructions = instructionsEditor.innerHTML;

    // Save to server
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipes)
        });

        const result = await response.json();

        if (response.ok) {
            isEditing = false;
            updateRecipeList();
            showRecipe(currentRecipeIndex);
            alert('✓ Recipe saved!');
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        alert('Error saving: ' + error.message);
        console.error('Error saving recipe:', error);
    }
}

// Cancel editing
function cancelEdit() {
    isEditing = false;
    if (currentRecipeIndex !== null) {
        showRecipe(currentRecipeIndex);
    }
}

// Delete ingredient
function deleteIngredient(index) {
    const ingredient = document.querySelector(`#ingredientsList input[data-index="${index}"]`);
    if (ingredient) {
        ingredient.closest('.ingredient-item').remove();
    }
}

// Add new ingredient
function addIngredient() {
    const list = document.getElementById('ingredientsList');
    const newIndex = list.children.length;
    const li = document.createElement('li');
    li.className = 'ingredient-item editing';
    li.innerHTML = `
        <input type="text" value="" data-index="${newIndex}" placeholder="Novi sastojak">
        <button class="btn-delete" onclick="deleteIngredient(${newIndex})">✗</button>
    `;
    list.appendChild(li);
    li.querySelector('input').focus();
}

// ============================================================================
// Label Management in Edit Mode
// ============================================================================

function addLabelToRecipe(label) {
    if (!label) return;

    const recipe = recipes[currentRecipeIndex];
    if (!recipe.labels) recipe.labels = [];

    if (!recipe.labels.includes(label)) {
        recipe.labels.push(label);
        startEdit(); // Refresh edit view
    }
}

function updateMealType(mealType) {
    const recipe = recipes[currentRecipeIndex];
    if (mealType === '') {
        delete recipe.mealType;
    } else {
        recipe.mealType = mealType;
    }
    startEdit(); // Refresh edit view
}

function updateSeason(season) {
    const recipe = recipes[currentRecipeIndex];
    if (season === '') {
        delete recipe.season;
    } else {
        recipe.season = season;
    }
    startEdit(); // Refresh edit view
}

function removeLabel(index) {
    const recipe = recipes[currentRecipeIndex];
    if (recipe.labels) {
        recipe.labels.splice(index, 1);
        startEdit(); // Refresh edit view
    }
}

function removeLabelByName(labelName) {
    const recipe = recipes[currentRecipeIndex];
    if (recipe.labels) {
        const index = recipe.labels.indexOf(labelName);
        if (index > -1) {
            recipe.labels.splice(index, 1);
            startEdit(); // Refresh edit view
        }
    }
}

function toggleLabelSelector() {
    const panel = document.getElementById('labelSelectorPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

// ============================================================================
// Rich Text Editor
// ============================================================================

function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('instructionsEditor').focus();
}

function clearFormatting() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
        const textNode = document.createTextNode(selectedText);
        range.deleteContents();
        range.insertNode(textNode);
    }

    document.getElementById('instructionsEditor').focus();
}

// ============================================================================
// Rating System
// ============================================================================

// Rate recipe
async function rateRecipe(rating) {
    if (currentRecipeIndex === null) return;

    const recipe = recipes[currentRecipeIndex];
    recipe.rating = rating;

    // Save to server
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipes)
        });

        const result = await response.json();

        if (response.ok) {
            // Update UI
            showRecipe(currentRecipeIndex);
        } else {
            alert('Error saving rating: ' + result.error);
        }
    } catch (error) {
        alert('Error saving rating: ' + error.message);
        console.error('Error saving rating:', error);
    }
}

// Add star hover effect
function addStarHoverEffect() {
    const stars = document.querySelectorAll('#starsDisplay .star');
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

// ============================================================================
// Utilities
// ============================================================================

// Export recipe data as JSON
function exportRecipe() {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipes.json';
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// Label Management Modal
// ============================================================================

function openLabelManager() {
    document.getElementById('labelModal').classList.add('active');
    updateExistingLabels();
}

function closeLabelManager() {
    document.getElementById('labelModal').classList.remove('active');
}

function updateExistingLabels() {
    const existingLabelsEl = document.getElementById('existingLabels');
    const exclusiveLabels = Object.values(exclusiveLabelGroups).flat();

    // Show regular labels
    let html = '<div style="margin-bottom: 15px;"><strong>Regular Labels</strong></div>';
    html += availableLabels.map(label => `
        <div class="existing-label">
            <span>${label}</span>
            <span class="label-remove" onclick="deleteLabel('${label}')">✗</span>
        </div>
    `).join('');

    // Show exclusive label groups (read-only)
    Object.entries(exclusiveLabelGroups).forEach(([groupName, groupLabels]) => {
        html += `<div style="margin-top: 20px; margin-bottom: 10px;"><strong>${groupName}</strong> (exclusive)</div>`;
        html += groupLabels.map(label => `
            <div class="existing-label" style="opacity: 0.7;">
                <span>${label}</span>
                <span style="color: #999;">⚠️</span>
            </div>
        `).join('');
    });

    existingLabelsEl.innerHTML = html;
}

function addNewLabel() {
    const input = document.getElementById('newLabelInput');
    const newLabel = input.value.trim().toLowerCase();

    if (!newLabel) {
        alert('Please enter a label name');
        return;
    }

    // Check if it's an exclusive label
    const exclusiveLabels = Object.values(exclusiveLabelGroups).flat();
    if (exclusiveLabels.includes(newLabel)) {
        alert('This label is part of an exclusive group and cannot be added as a regular label');
        return;
    }

    if (availableLabels.includes(newLabel)) {
        alert('Label already exists');
        return;
    }

    availableLabels.push(newLabel);
    input.value = '';
    updateExistingLabels();
    updateFilterLabels();
}

function deleteLabel(label) {
    if (!confirm(`Do you want to delete the label "${label}"? It will be removed from all recipes.`)) {
        return;
    }

    // Remove from available labels
    const index = availableLabels.indexOf(label);
    if (index > -1) {
        availableLabels.splice(index, 1);
    }

    // Remove from all recipes
    recipes.forEach(recipe => {
        if (recipe.labels) {
            recipe.labels = recipe.labels.filter(l => l !== label);
        }
    });

    updateExistingLabels();
    updateFilterLabels();
    applyFilters();
}

// ============================================================================
// Initialization
// ============================================================================

// Initialize rating filter
function initRatingFilter() {
    const ratingFilterEl = document.getElementById('ratingFilter');
    if (ratingFilterEl) {
        ratingFilterEl.innerHTML = [1, 2, 3, 4, 5].map(r =>
            `<span class="star" data-rating="${r}" onclick="filterByRating(${r})">★</span>`
        ).join('');
    }
}

// Add keyboard shortcuts for rich text editor
document.addEventListener('keydown', function(e) {
    const editor = document.getElementById('instructionsEditor');
    if (!editor || document.activeElement !== editor) return;

    if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                formatText('bold');
                break;
            case 'i':
                e.preventDefault();
                formatText('italic');
                break;
        }
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            applyFilters();
        });
    }

    // Initialize and load
    initRatingFilter();
    loadRecipes();
});
