document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', searchRecipe);
    
});

const apiKey = 'QEv97buItUcJnrHCe58zEQ==qyb4uvIa16MjkYLW';
const unsplashAccessKey = 'C5tROdGkMFpugF5UOODbqMeGscF8uRF725IjyIO-hjY';

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

// Main Function to Search and Display Recipes
//pahila code yaha bata suru hunxa
async function searchRecipe() {
    document.querySelector('.loading-spinner').style.display = 'block';
    console.log('Search button clicked'); // Debugging line
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter a recipe name.');
        return;
    }
    const resultsDiv = document.getElementById('recipe-container');

    const recipes = await fetchRecipeData(query);
    if (recipes.length === 0) {
        resultsDiv.innerHTML = `<p>No recipes found for "${query}". Please try another search term.</p>`;
        return;
    }

    for (const recipe of recipes) {
        const imageUrl = await fetchImage(recipe.title);
        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe-card';
        recipeDiv.innerHTML = `
            <img src="${imageUrl}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        `;
        resultsDiv.appendChild(recipeDiv);
        document.querySelector('.loading-spinner').style.display = 'none';
        break; // Display only the first recipe for simplicity
    }
}