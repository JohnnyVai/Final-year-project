document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', searchRecipe);
});

// API keys should be stored securely, not hardcoded in the script
const apiKey = process.env.API_NINJAS_KEY;
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

// Function to Fetch Recipe Data
async function fetchRecipeData(query) {
    const apiUrl = `https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(apiUrl, {
            headers: { 'X-Api-Key': apiKey }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipe data:', error);
        return [];
    }
}

// Function to Fetch Image from Unsplash
async function fetchImage(query) {
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${unsplashAccessKey}&per_page=1`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        } else {
            return 'https://via.placeholder.com/600x400?text=No+Image';
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'https://via.placeholder.com/600x400?text=No+Image';
    }
}

// Function to create a recipe card
function createRecipeCard(recipe, imageUrl) {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-card';
    recipeDiv.innerHTML = `
        <img src="${imageUrl}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
    `;
    return recipeDiv;
}

// Main Function to Search and Display Recipes
async function searchRecipe() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    loadingSpinner.style.display = 'block';

    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter a recipe name.');
        loadingSpinner.style.display = 'none';
        return;
    }

    const resultsDiv = document.getElementById('recipe-container');
    resultsDiv.innerHTML = ''; // Clear previous results

    try {
        const recipes = await fetchRecipeData(query);
        if (recipes.length === 0) {
            resultsDiv.innerHTML = `<p>No recipes found for "${query}". Please try another search term.</p>`;
        } else {
            // Display only the first recipe for simplicity
            const recipe = recipes[0];
            const imageUrl = await fetchImage(recipe.title);
            const recipeCard = createRecipeCard(recipe, imageUrl);
            resultsDiv.appendChild(recipeCard);
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error fetching recipes. Please try again later.</p>`;
        console.error('Error in searchRecipe:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}
