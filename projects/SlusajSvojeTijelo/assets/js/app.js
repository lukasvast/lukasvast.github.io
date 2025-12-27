// State Management
let recipes = [];
let availableLabels = [];
let activeFilters = {
    labels: [],
    mealTypes: [],
    seasons: [],
    minRating: 0,
    searchTerm: ''
};

// Exclusive label groups
const exclusiveLabelGroups = {
    'Meal Type': ['breakfast', 'lunch', 'snack', 'dessert'],
    'Season': ['spring', 'summer', 'autumn', 'winter']
};

// Label configuration
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

// Emoji mapping for meal types
const mealTypeEmojis = {
    'breakfast': '🌅',
    'lunch': '🍽️',
    'snack': '🍪',
    'dessert': '🍰',
    'default': '🍴'
};

function getLabelConfig(label) {
    return labelConfig[label] || { icon: '🏷️', color: '#f97316' };
}

// ============================================================================
// UI Functions
// ============================================================================

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
}

function openRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalContent = document.getElementById('modalContent');

    const rating = recipe.rating || 0;
    const allLabels = [];

    // Collect all labels
    if (recipe.labels) allLabels.push(...recipe.labels);
    if (recipe.mealType) allLabels.push(recipe.mealType);
    if (recipe.season) allLabels.push(recipe.season);

    // Find recipe index
    const recipeIndex = recipes.findIndex(r => r.name === recipe.name);

    modalContent.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${recipe.name}</h2>
            <div class="modal-meta">
                <div class="modal-rating">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <span class="star ${star <= rating ? '' : 'empty'}">★</span>
                    `).join('')}
                </div>
                ${allLabels.length > 0 ? `
                    <div class="modal-labels">
                        ${allLabels.map(label => {
                            const config = getLabelConfig(label);
                            return `<span class="modal-label-tag">${config.icon} ${label}</span>`;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">📝 Ingredients</h3>
            <div class="modal-ingredients">
                ${recipe.ingredients.map(ing => `
                    <div class="modal-ingredient">${ing}</div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title">👨‍🍳 Instructions</h3>
            <div class="modal-instructions">${recipe.instructions}</div>
        </div>

        <div class="modal-actions">
            <button class="modal-btn btn-edit" onclick="openEditMode(${recipeIndex})">✏️ Edit Recipe</button>
        </div>
    `;

    modal.classList.add('active');
}

function openEditMode(recipeIndex) {
    // Redirect to edit page with recipe index
    window.location.href = `/edit.html?index=${recipeIndex}`;
}

// ============================================================================
// Data Loading
// ============================================================================

async function loadRecipes() {
    try {
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = '<div class="loading">Loading recipes...</div>';

        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to load recipes');
        recipes = await response.json();

        // Extract all unique labels
        availableLabels = [];
        recipes.forEach(recipe => {
            if (recipe.labels) {
                recipe.labels.forEach(label => {
                    if (!availableLabels.includes(label)) {
                        availableLabels.push(label);
                    }
                });
            }
        });

        initializeFilters();
        displayRecipes();
    } catch (error) {
        const container = document.getElementById('categoriesContainer');
        container.innerHTML = `
            <div class="empty-state">
                <h2>Error loading recipes</h2>
                <p>Check if the server is running</p>
            </div>
        `;
        console.error('Error loading recipes:', error);
    }
}

// ============================================================================
// Filter Management
// ============================================================================

function initializeFilters() {
    // Initialize Labels
    const labelFiltersEl = document.getElementById('labelFilters');
    labelFiltersEl.innerHTML = availableLabels.map(label => {
        const config = getLabelConfig(label);
        return `
            <div class="filter-option" data-filter-type="label" data-filter-value="${label}" onclick="toggleFilter('label', '${label}')">
                <div class="filter-checkbox"></div>
                <span class="filter-label-text">${config.icon} ${label}</span>
            </div>
        `;
    }).join('');

    // Initialize Meal Types
    const mealTypeFiltersEl = document.getElementById('mealTypeFilters');
    mealTypeFiltersEl.innerHTML = exclusiveLabelGroups['Meal Type'].map(type => {
        const config = getLabelConfig(type);
        return `
            <div class="filter-option" data-filter-type="mealType" data-filter-value="${type}" onclick="toggleFilter('mealType', '${type}')">
                <div class="filter-checkbox"></div>
                <span class="filter-label-text">${config.icon} ${type}</span>
            </div>
        `;
    }).join('');

    // Initialize Seasons
    const seasonFiltersEl = document.getElementById('seasonFilters');
    seasonFiltersEl.innerHTML = exclusiveLabelGroups['Season'].map(season => {
        const config = getLabelConfig(season);
        return `
            <div class="filter-option" data-filter-type="season" data-filter-value="${season}" onclick="toggleFilter('season', '${season}')">
                <div class="filter-checkbox"></div>
                <span class="filter-label-text">${config.icon} ${season}</span>
            </div>
        `;
    }).join('');

    // Initialize Ratings
    const ratingFiltersEl = document.getElementById('ratingFilters');
    ratingFiltersEl.innerHTML = [5, 4, 3, 2, 1].map(rating => `
        <div class="filter-option" data-filter-type="rating" data-filter-value="${rating}" onclick="toggleFilter('rating', ${rating})">
            <div class="filter-checkbox"></div>
            <span class="filter-label-text">${'★'.repeat(rating)} & up</span>
        </div>
    `).join('');
}

function toggleFilter(type, value) {
    if (type === 'label') {
        const index = activeFilters.labels.indexOf(value);
        if (index > -1) {
            activeFilters.labels.splice(index, 1);
        } else {
            activeFilters.labels.push(value);
        }
    } else if (type === 'mealType') {
        const index = activeFilters.mealTypes.indexOf(value);
        if (index > -1) {
            activeFilters.mealTypes.splice(index, 1);
        } else {
            activeFilters.mealTypes.push(value);
        }
    } else if (type === 'season') {
        const index = activeFilters.seasons.indexOf(value);
        if (index > -1) {
            activeFilters.seasons.splice(index, 1);
        } else {
            activeFilters.seasons.push(value);
        }
    } else if (type === 'rating') {
        activeFilters.minRating = activeFilters.minRating === value ? 0 : value;
    }

    updateFilterUI();
    displayRecipes();
}

function updateFilterUI() {
    // Update labels
    document.querySelectorAll('[data-filter-type="label"]').forEach(el => {
        const value = el.dataset.filterValue;
        if (activeFilters.labels.includes(value)) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update meal types
    document.querySelectorAll('[data-filter-type="mealType"]').forEach(el => {
        const value = el.dataset.filterValue;
        if (activeFilters.mealTypes.includes(value)) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update seasons
    document.querySelectorAll('[data-filter-type="season"]').forEach(el => {
        const value = el.dataset.filterValue;
        if (activeFilters.seasons.includes(value)) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update rating
    document.querySelectorAll('[data-filter-type="rating"]').forEach(el => {
        const value = parseInt(el.dataset.filterValue);
        if (activeFilters.minRating === value) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

function clearAllFilters() {
    activeFilters = {
        labels: [],
        mealTypes: [],
        seasons: [],
        minRating: 0,
        searchTerm: ''
    };
    document.getElementById('searchInput').value = '';
    updateFilterUI();
    displayRecipes();
}

// ============================================================================
// Search Function
// ============================================================================

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    activeFilters.searchTerm = searchInput.value;
    displayRecipes();
}

// Listen for Enter key in search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// ============================================================================
// Display Recipes
// ============================================================================

function displayRecipes() {
    const container = document.getElementById('categoriesContainer');

    // Filter recipes
    let filteredRecipes = recipes.filter(recipe => {
        // Search filter (with regex support)
        if (activeFilters.searchTerm) {
            try {
                const regex = new RegExp(activeFilters.searchTerm, 'i');
                if (!regex.test(recipe.name)) return false;
            } catch (e) {
                // If regex is invalid, fall back to simple string match
                if (!recipe.name.toLowerCase().includes(activeFilters.searchTerm.toLowerCase())) {
                    return false;
                }
            }
        }

        // Label filter
        if (activeFilters.labels.length > 0) {
            const recipeLabels = recipe.labels || [];
            if (!activeFilters.labels.every(label => recipeLabels.includes(label))) {
                return false;
            }
        }

        // Meal type filter
        if (activeFilters.mealTypes.length > 0) {
            if (!recipe.mealType || !activeFilters.mealTypes.includes(recipe.mealType)) {
                return false;
            }
        }

        // Season filter
        if (activeFilters.seasons.length > 0) {
            if (!recipe.season || !activeFilters.seasons.includes(recipe.season)) {
                return false;
            }
        }

        // Rating filter
        if (activeFilters.minRating > 0) {
            const rating = recipe.rating || 0;
            if (rating < activeFilters.minRating) return false;
        }

        return true;
    });

    if (filteredRecipes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No recipes found</h2>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    // Group recipes by categories
    const categories = [];

    // Top Rated
    const topRated = filteredRecipes
        .filter(r => (r.rating || 0) >= 4)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 12);

    if (topRated.length > 0) {
        categories.push({
            title: 'Top Rated',
            recipes: topRated
        });
    }

    // By Meal Type
    exclusiveLabelGroups['Meal Type'].forEach(mealType => {
        const mealRecipes = filteredRecipes
            .filter(r => r.mealType === mealType)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 12);

        if (mealRecipes.length > 0) {
            categories.push({
                title: mealType.charAt(0).toUpperCase() + mealType.slice(1),
                recipes: mealRecipes
            });
        }
    });

    // By Season
    exclusiveLabelGroups['Season'].forEach(season => {
        const seasonRecipes = filteredRecipes
            .filter(r => r.season === season)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 12);

        if (seasonRecipes.length > 0) {
            categories.push({
                title: season.charAt(0).toUpperCase() + season.slice(1),
                recipes: seasonRecipes
            });
        }
    });

    // By Labels
    availableLabels.forEach(label => {
        const labelRecipes = filteredRecipes
            .filter(r => (r.labels || []).includes(label))
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 12);

        if (labelRecipes.length > 0) {
            categories.push({
                title: label.charAt(0).toUpperCase() + label.slice(1),
                recipes: labelRecipes
            });
        }
    });

    // All Recipes (if not too many)
    if (filteredRecipes.length <= 50) {
        categories.push({
            title: 'All Recipes',
            recipes: filteredRecipes.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        });
    }

    // Render categories
    container.innerHTML = categories.map(category => renderCategory(category)).join('');
}

function renderCategory(category) {
    return `
        <div class="category-section">
            <div class="category-header">
                <h2 class="category-title">${category.title}</h2>
                <span class="category-badge">${category.recipes.length}</span>
            </div>
            <div class="recipe-cards">
                ${category.recipes.map(recipe => renderRecipeCard(recipe)).join('')}
            </div>
        </div>
    `;
}

function renderRecipeCard(recipe) {
    const rating = recipe.rating || 0;
    const emoji = mealTypeEmojis[recipe.mealType] || mealTypeEmojis.default;

    // Collect visible labels (first 2)
    const visibleLabels = (recipe.labels || []).slice(0, 2);

    return `
        <div class="recipe-card" onclick='openRecipeModal(${JSON.stringify(recipe).replace(/'/g, "&#39;")})'>
            <div class="recipe-card-image">
                <div class="recipe-card-emoji">${emoji}</div>
            </div>
            <div class="recipe-card-content">
                <h3 class="recipe-card-title">${recipe.name}</h3>
                <div class="recipe-card-meta">
                    ${rating > 0 ? `
                        <div class="recipe-rating">
                            <span>★</span>
                            <span>${rating.toFixed(1)}</span>
                        </div>
                    ` : ''}
                </div>
                ${visibleLabels.length > 0 ? `
                    <div class="recipe-labels">
                        ${visibleLabels.map(label => {
                            const config = getLabelConfig(label);
                            return `<span class="recipe-label-tag">${config.icon} ${label}</span>`;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================================================
// Initialization
// ============================================================================

loadRecipes();
