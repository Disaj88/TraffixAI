<?php
// db_connect.php

// Database credentials - IMPORTANT: Replace with your actual credentials
define('DB_SERVER', 'localhost'); // Usually 'localhost'
define('DB_USERNAME', 'root'); // e.g., 'root' for local, or a specific user for hosting
define('DB_PASSWORD', ''); // Your MySQL user's password
define('DB_NAME', 'my_website_db');       // The name of the database you created

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: Set character set for proper data handling (e.g., emojis, special characters)
$conn->set_charset("utf8mb4");

// Start session here if you want to display success/error messages via session variables
// session_start(); // You'll typically start session in signup.php itself
?>