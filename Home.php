<?php
session_start();

// Redirect if not logged in
//Index.php ma firta pathaidinxa if not logged in
if (!isset($_SESSION["username"])) {
    header("Location: index.php");
    exit();
}

$username = $_SESSION["username"];
$email = $_SESSION["email"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="home.css">
    <script src="script.js"></script>
    
</head>

<body>
    <!-- Talako function le John name xa vane J matra display gardinxa -->
    <?$user_initial= substr($username, 0, 1);  ?>
    <nav>
        <div class="logo">RecipeFinder</div>
        <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#categories">Categories</a>
            <a href="#saved">Saved Recipes</a>
            <a href="#settings">Settings</a>
            <a href="logout.php">Logout</a>

            <div class="user-profile" title="User Profile"><? echo $user_initial; ?></div>
        </div>
    </nav>

    <div class="search-container">
        <div class="search-box">
            <input type="text" id="search-input" placeholder="Search for recipes...">
            <select id="diet-filter">
                <option value="">All Diets</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="keto">Keto</option>
            </select>
            <button id="search-button">Search</button>
        </div>
    </div>

    <div class="loading-spinner"></div>

    <div class="recipe-container" id="recipe-container">
        <!-- Recipe cards will be dynamically added here -->
        <div class="recipe-card">
            <img src="https://chocolatewithgrace.com/wp-content/uploads/2023/07/Oreo-Pancakes-CWG-12-1-of-1-1536x1097.jpg" alt="Delicious Pancakes">
            <h3>Delicious Pancakes</h3>
            <p><strong>Ingredients:</strong> Flour, Eggs, Milk, Sugar, Baking Powder</p>
            <p><strong>Servings:</strong> 4</p>
            <p><strong>Instructions:</strong> Mix ingredients, cook on a pan, and serve hot.</p>
        </div>
        <!-- More recipe cards -->
    </div>
</body>
</html>

