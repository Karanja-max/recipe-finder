//  0. CHECK SAVED THEME ON LOAD 
// We use an IIFE (Immediately Invoked Function Expression)
// to run this code right when the page loads.
// This prevents the "flash" of light mode if dark is saved.
(function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();

//  1. SETUP 
// Select elements from the DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loadingMessage = document.getElementById('loading-message');

//  NEW 
const dietFilter = document.getElementById('filter-diet');
const mealFilter = document.getElementById('filter-meal');
const cuisineFilter = document.getElementById('filter-cuisine');
//  END NEW 

//  NEW: Create and add the modal structure to the page ---
const modalOverlay = document.createElement('div');
modalOverlay.id = 'modal-overlay';
modalOverlay.classList.add('modal-overlay');
document.body.appendChild(modalOverlay);
//  END NEW 

// API_KEY is loaded from config.js (which is in .gitignore)
// This keeps your key secret!

//  2. EVENT LISTENER 
searchForm.addEventListener('submit', function (e) {
    // Prevent the form from submitting the traditional way
    e.preventDefault();

    // Get the user's search query (the ingredients)
    const query = searchInput.value.trim();

    //  NEW: Get filter values 
    const diet = dietFilter.value;
    const meal = mealFilter.value;
    const cuisine = cuisineFilter.value;
    //  END NEW 

    if (query) {
        // Show the loading message
        loadingMessage.classList.remove('hidden');
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Call the function to fetch recipes
        //  UPDATED: Pass all values 
        fetchRecipes(query, diet, meal, cuisine);
    }
});

//  3. ASYNC FUNCTION TO FETCH DATA (Updated for /api/recipes/v2)
//  UPDATED: Accept new arguments 
async function fetchRecipes(query, diet, meal, cuisine) {
    // This is the new API URL from RapidAPI
    // It requires a 'type=public' parameter
    const apiUrl = `https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2?type=public&q=${query}`;

    // NEW: Add filters to the URL ONLY if they are selected 
    if (diet) {
        apiUrl += `&health=${diet}`;
    }
    if (meal) {
        apiUrl += `&mealType=${meal}`;
    }
    if (cuisine) {
        apiUrl += `&cuisineType=${cuisine}`;
    }
    //  END NEW 

    // These are the "options" required by RapidAPI, including your key
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY, // The key from config.js
            'X-RapidAPI-Host': 'edamam-recipe-search.p.rapidapi.com'
        }
    };

    try {
        // 'await' pauses the function until the 'fetch' request completes
        const response = await fetch(apiUrl, options);

        // Check if the response was not successful
        if (!response.ok) {
            // Throw an error to be caught by the 'catch' block
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 'await' pauses until the response is converted to JSON
        const data = await response.json();

        // Pass the array of recipes (data.hits) to the display function
        displayRecipes(data.hits);

    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching recipes:', error);
        resultsContainer.innerHTML = `<p style="text-align:center; color: red;">Sorry, we couldn't fetch recipes. (Error: ${error.message})</p>`;
    } finally {
        // Hide the loading message (whether it succeeded or failed)
        loadingMessage.classList.add('hidden');
    }
}

// 4. FUNCTION TO DISPLAY RECIPES (DOM Manipulation) 
function displayRecipes(recipes) {
    if (recipes.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align:center;">No recipes found for those ingredients. Try a different search.</p>';
        return;
    }

    // Loop through each recipe 'hit' in the array
    recipes.forEach(hit => {
        // Get the recipe object from the 'hit'
        const recipe = hit.recipe;

        //  NEW: Clean up data 
        const calories = Math.round(recipe.calories / recipe.yield);
        const cookTime = recipe.totalTime > 0 ? `${recipe.totalTime} min` : 'N/A';
        //  END NEW 

        // 1. Create a new <div> element for the card
        const card = document.createElement('div');
        card.classList.add('recipe-card');

        // 2. Populate the card's inner HTML
        // Note: We use target="_blank" to open the recipe link in a new tab
        // We also use rel="noopener noreferrer" for security
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <div class="recipe-card-content">
                <h2>${recipe.label}</h2>
                <div class.recipe-card-info">
                    <span>${calories} kcal</span>
                    <span>${cookTime}</span>
                </div>
                <div class="recipe-card-buttons">
                <a href="${recipe.url}" target="_blank" rel="noopener noreferrer">View Recipe</a>
                <button class="view-ingredients-btn">Ingredients</button>
            </div>
            </div>
        `;

        // 3. Append the new card to the results container
        resultsContainer.appendChild(card);
        //  NEW: Add event listener for the *specific* button we just created 
        card.querySelector('.view-ingredients-btn').addEventListener('click', () => {
            showIngredientsModal(recipe);
        });
        //  END NEW 
    });
}

//  5. THEME TOGGLER (Updated with localStorage) 

// Select the button
const themeToggle = document.getElementById('theme-toggle');

// Listen for a click on the button
themeToggle.addEventListener('click', () => {
    // Toggle the .dark-mode class on the <body>
    document.body.classList.toggle('dark-mode');

    // --- NEW ---
    // Save the user's preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark'); // Save "dark"
    } else {
        localStorage.setItem('theme', 'light'); // Save "light"
    }
    //  END NEW 
});

//  6. MODAL FUNCTIONS (New Section) 

// This is the modalOverlay we created in Step 1
const modalOverlayEl = document.getElementById('modal-overlay');

function showIngredientsModal(recipe) {
    // 1. Build the HTML for the modal
    modalOverlayEl.innerHTML = `
        <div class="modal">
            <button class="modal-close-btn">&times;</button>
            <h2>${recipe.label}</h2>
            <ul class="modal-ingredients">
                ${recipe.ingredientLines.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    `;

    // 2. Add class to show the modal
    modalOverlayEl.classList.add('visible');

    // 3. Add event listener to the close button
    modalOverlayEl.querySelector('.modal-close-btn').addEventListener('click', closeModal);
}

function closeModal() {
    modalOverlayEl.classList.remove('visible');
    // We clear the HTML so it's fresh for the next recipe
    modalOverlayEl.innerHTML = '';
}

// Optional: Add event listener to close modal by clicking the background
modalOverlayEl.addEventListener('click', (e) => {
    // If we clicked the overlay itself (not the modal content)
    if (e.target === modalOverlayEl) {
        closeModal();
    }
});
//  END OF NEW SECTION 