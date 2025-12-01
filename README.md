# 🍳 Recipe Finder

A simple web app to find recipes based on the ingredients you have at home.
Built with plain HTML, CSS, and JavaScript, and powered by the Edamam API.

[View the live demo here!](https://karanja-max.github.io/recipe-finder/)

<img wi<img width="1896" height="833" alt="Screenshot 2025-11-16 190728" src="https://github.com/user-attachments/assets/bc5e29f8-8429-4dc8-9c99-752fa60a4db5" />

How It Works

This project demonstrates several key web development skills:

HTML5: Structured with semantic HTML (`<header>`, `<main>`).
CSS3: Styled with modern CSS, including **Flexbox** for the form and **CSS Grid** (`repeat(auto-fit, minmax(300px, 1fr))`) for a fully responsive card layout.
JavaScript (ES6+):
    DOM Manipulation: Dynamically creates and injects recipe cards into the page.
    *Fetch API: Uses `async/await` to make asynchronous calls to the Edamam API.
    Error Handling: Implements `try...catch...finally` to manage API errors (like 404s and 403s) and loading states.
    API Key Security: The API key is stored in a `config.js` file, which is excluded from the repository via `.gitignore` to prevent leaks.

Challenges & What I Learned

A key challenge was navigating the API documentation. I initially faced a 404 "Not Found" error, which I fixed by finding the correct API endpoint (`/api/recipes/v2`).
I then solved a 403 "Forbidden" error by ensuring my API key was correctly placed in a separate, ignored config file and that I was properly subscribed to the free plan on RapidAPI.
This was a great real-world lesson in debugging API connections.

How to Run Locally

1. Clone this repository.
2. Sign up for the [Edamam API on RapidAPI](https://rapidapi.com/edamam/api/recipe-search-and-diet) to get a free API key.
3. Create a `config.js` file in the root directory.
4. Inside `config.js`, add one line: `const API_KEY = 'YOUR_RAPIDAPI_KEY_HERE';`
5. Open `index.html` (or use a tool like VS Code's Live Server).
