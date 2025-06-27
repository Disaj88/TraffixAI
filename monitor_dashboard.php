<?php
// monitor_dashboard.php
session_start();

// Check if the user is logged in AND if they have the 'admin' role
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true || !isset($_SESSION["role"]) || $_SESSION["role"] !== 'admin') {
    // If not logged in or not an admin, redirect them to the login page
    header("location: login.php");
    exit;
}

// Get the username from the session to pass to React
$adminUsername = htmlspecialchars($_SESSION["username"]);

// If the user is an admin, proceed to display the dashboard HTML/React app
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TraffixAI Admin Dashboard</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Basic keyframe animation for welcome message (for vanilla CSS) */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 2s ease-out forwards;
        }
    </style>
</head>
<body>
    <div id="root" data-username="<?php echo $adminUsername; ?>"></div> <!-- React app mounts here, pass username -->

    <!-- React and ReactDOM CDNs -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <!-- MQTT.js library for frontend communication -->
    <script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
    <!-- Babel Standalone for in-browser JSX transpilation (DEVELOPMENT ONLY) -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>  <-- ADD THIS LINE -->
    <!-- Load your dashboard app JavaScript with type="text/babel" -->
    <script type="text/babel" src="js/dashboard_app.js"></script>  <-- CHANGE THIS LINE -->
</body>
</html>
