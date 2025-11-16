// --- 1. SETUP ---
// Select elements from the DOM
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loadingMessage = document.getElementById('loading-message');

// API_KEY is loaded from config.js (which is in .gitignore)
// This keeps your key secret!

// --- 2. EVENT LISTENER ---
searchForm.addEventListener('submit', function (e) {
    // Prevent the form from submitting the traditional way
    e.preventDefault();

    // Get the user's search query (the ingredients)
    const query = searchInput.value.trim();

    if (query) {
        // Show the loading message
        loadingMessage.classList.remove('hidden');
        // Clear previous results
        resultsContainer.innerHTML = '';

        // Call the function to fetch recipes
        fetchRecipes(query);
    }
});

//  3. ASYNC FUNCTION TO FETCH DATA (Updated for /api/recipes/v2) 
async function fetchRecipes(query) {
    // This is the new API URL from RapidAPI
    // It requires a 'type=public' parameter
    const apiUrl = `https://edamam-recipe-search.p.rapidapi.com/api/recipes/v2?type=public&q=${query}`;

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
                <a href="${recipe.url}" target="_blank" rel="noopener noreferrer">View Recipe</a>
            </div>
        `;

        // 3. Append the new card to the results container
        resultsContainer.appendChild(card);
    });
}