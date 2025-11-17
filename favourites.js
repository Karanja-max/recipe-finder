//  This is the ENTIRE favorites.js file 

//  1. THEME TOGGLER LOGIC 
// (We need this on our favorites page, too!)
(function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

//  2. LOAD AND DISPLAY FAVORITES 
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

function loadFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorites-container');

    container.innerHTML = ''; // Clear existing content

    if (favorites.length === 0) {
        container.innerHTML = '<p>You haven\'t saved any favorite recipes yet.</p>';
        return;
    }

    favorites.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');

        // We use the same card structure
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <div class="recipe-card-content">
                <h2>${recipe.label}</h2>
                <div class="recipe-card-info">
                    <span>${recipe.calories} kcal</span>
                    <span>${recipe.cookTime}</span>
                </div>
                
                <div class="recipe-card-buttons">
                    <div class="recipe-card-buttons-row">
                        <a href="${recipe.url}" target="_blank" rel="noopener noreferrer">View Recipe</a>
                        </div>
                    <button class="remove-btn" data-recipe-id="${recipe.id}">
                        Remove from Favorites
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);

        // Add listener for the REMOVE button
        card.querySelector('.remove-btn').addEventListener('click', (e) => {
            removeFavorite(recipe.id);
            // Reload the favorites list to show the change
            loadFavorites();
        });
    });
}

//  3. LOCALSTORAGE HELPER FUNCTIONS 
// (These are duplicates from script.js, which is okay for this small app)

function getFavorites() {
    const favsJSON = localStorage.getItem('favorites') || '[]';
    return JSON.parse(favsJSON);
}

function saveFavorites(favorites) {
    const favsJSON = JSON.stringify(favorites);
    localStorage.setItem('favorites', favsJSON);
}

function removeFavorite(recipeId) {
    let favorites = getFavorites();
    // Filter OUT the recipe we want to remove
    const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
    saveFavorites(updatedFavorites);
}

//  4. SERVICE WORKER REGISTRATION 

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}