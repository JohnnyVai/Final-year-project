<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Retrieve form data and sanitize as needed
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    // Hash the password (use a secure method in production)
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $file = 'users.json';

    // Read the current users from the JSON file (ensure file exists and handle errors)
    $users = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    // Check for existing user (email or username)
    $emailExists = false;
    $usernameExists = false;
    $bothexists=false;

    foreach ($users as $user) {
        if ($user["email"] === $email) {
            $emailExists = true;
        }
        if ($user["username"] === $username) {
            $usernameExists = true;
        }
        if ($user["email"] === $email && $user["username"] === $username) {
            $bothexists = true;
        }
    }
    if ($bothexists){
        header("Location: Signup.php?error=" . urlencode("Both Username and Email already exist."));
        exit();

    }

    // Handle the error cases for email or username already taken
    if ($emailExists) {
        header("Location: Signup.php?error=" . urlencode("Email already exists"));
        exit();  // Prevent further execution
    }
    if ($usernameExists) {
        header("Location: Signup.php?error=" . urlencode("Username already exists"));
        exit();  // Prevent further execution
    }

    // If we reach this point, no existing email or username found, add new user
    $users[] = [
        "username" => $username,
        "email" => $email,
        "password" => $hashed_password
    ];

    // Save back to the JSON file
    file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

    // Start session
    $_SESSION["username"] = $username;
    $_SESSION["email"] = $email;

    // Redirect to index.php with a success message
    header("Location: index.php?success=" . urlencode("Account Created Successfully"));
    exit();  // Prevent further execution
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
</head>

<body>
    <div class="login-container">
        <form class="login-form" action="" method="POST">
            <h2>Signup</h2>
            <div class="input-group">
                <input type="text" name="username" required>
                <label for="username">Username</label>
            </div>

            <div class="input-group">
                <input type="email" name="email" required>
                <label for="email">Email</label>
            </div>

            <div class="input-group">
                <input type="password" name="password" required>
                <label for="password">Password</label>
            </div>

           
            <?php
            // Error message display
            if (isset($_GET["error"])) {
                $error = htmlspecialchars($_GET["error"], ENT_QUOTES, 'UTF-8');
                echo '<div class="error-message">' . $error . '</div>';
            }
            ?>

            <button type="submit">Signup</button>
        </form>
    </div>
</body>

</html>