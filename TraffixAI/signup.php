<?php
// signup.php
session_start(); // Start the session at the very top of the script

// Include your database connection file
require_once 'connect.php'; 

// Define variables and initialize with empty values
$username = $password = $email = "";
$username_err = $password_err = $email_err = $confirm_password_err = $general_err = "";
$registration_success = "";

// Process form submission when the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Validate Username
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter a username.";
    } else {
        // Prepare a select statement to check if username already exists
        $sql = "SELECT id FROM users WHERE username = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $param_username);
            $param_username = trim($_POST["username"]);
            if ($stmt->execute()) {
                $stmt->store_result();
                if ($stmt->num_rows == 1) {
                    $username_err = "This username is already taken.";
                } else {
                    $username = trim($_POST["username"]);
                }
            } else {
                $general_err = "Oops! Something went wrong with username check. Please try again later.";
            }
            $stmt->close();
        }
    }

    // 2. Validate Email
    if (empty(trim($_POST["email"]))) {
        $email_err = "Please enter an email.";
    } elseif (!filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL)) {
        $email_err = "Invalid email format.";
    } else {
        // Check if email already exists
        $sql = "SELECT id FROM users WHERE email = ?";
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $param_email);
            $param_email = trim($_POST["email"]);
            if ($stmt->execute()) {
                $stmt->store_result();
                if ($stmt->num_rows == 1) {
                    $email_err = "This email is already registered.";
                } else {
                    $email = trim($_POST["email"]);
                }
            } else {
                $general_err = "Oops! Something went wrong with email check. Please try again later.";
            }
            $stmt->close();
        }
    }

    // 3. Validate Password
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter a password.";
    } elseif (strlen(trim($_POST["password"])) < 6) {
        $password_err = "Password must have at least 6 characters.";
    } else {
        $password = trim($_POST["password"]);
    }

    // 4. Validate Confirm Password (only client-side, but good to double check)
    if (empty(trim($_POST["confirm_password"]))) {
        $confirm_password_err = "Please confirm password.";     
    } else {
        $confirm_password = trim($_POST["confirm_password"]);
        if (empty($password_err) && ($password != $confirm_password)) {
            $confirm_password_err = "Password did not match.";
        }
    }


    // 5. Check for validation errors before inserting into database
    if (empty($username_err) && empty($email_err) && empty($password_err) && empty($confirm_password_err) && empty($general_err)) {

        // Prepare an insert statement
        $sql = "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
            // Bind parameters
            // "sss" indicates three string parameters
            $stmt->bind_param("sss", $param_username, $param_password_hash, $param_email);

            // Set parameters
            $param_username = $username;
            // Hash the password using password_hash() before storing it
            $param_password_hash = password_hash($password, PASSWORD_DEFAULT); 
            $param_email = $email;

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                $registration_success = "Registration successful! You can now log in.";
                // Optionally, redirect after successful registration
                // This ensures the form isn't resubmitted if the user refreshes
                $_SESSION['registration_success'] = "Registration successful! You can now log in.";
                header("location: login.php"); // Redirect to the login page
                exit(); // Always call exit() after header() to stop further script execution
            } else {
                $general_err = "Something went wrong. Please try again later. (" . $stmt->error . ")"; // Add $stmt->error for debugging
            }
            $stmt->close(); // Close statement
        }
    }
    
    // Close connection at the end of the script execution (or after all DB operations)
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signup</title>
  <link rel="stylesheet" href="css/login-style.css">

  <script type="text/javascript" src="validation.js" defer></script> 
  <style>
      /* Add these styles to your css/login-style.css or directly here for testing */
      .error-message { color: red; font-size: 0.9em; margin-top: 5px; display: block; }
      .success-message { color: green; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>Signup</h1>
    
    <?php 
    if (!empty($registration_success)) {
        echo '<p class="success-message">' . $registration_success . '</p>';
    }
    if (!empty($general_err)) {
        echo '<p class="error-message">' . $general_err . '</p>';
    }
    ?> 
    <p id="client-error-message"></p> 

    <form id="form" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>"> 
      <div>
        <label for="user-input">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>
        </label>
        <input type="text" name="username" id="user-input" placeholder="Username" value="<?php echo htmlspecialchars($username); ?>"> 
        <span class="error-message"><?php echo $username_err; ?></span>
      </div>
      <div> 
        <label for="email-input">
          <span>@</span>
        </label>
        <input type="email" name="email" id="email-input" placeholder="Email" value="<?php echo htmlspecialchars($email); ?>"> 
        <span class="error-message"><?php echo $email_err; ?></span>
      </div>
      <div>
        <label for="password-input">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
        </label>
        <input type="password" name="password" id="password-input" placeholder="Password"> 
        <span class="error-message"><?php echo $password_err; ?></span>
      </div>
      <div>
        <label for="repeat-password-input">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
        </label>
        <input type="password" name="confirm_password" id="repeat-password-input" placeholder="Repeat Password"> 
        <span class="error-message"><?php echo $confirm_password_err; ?></span>
      </div>
      <button type="submit">Signup</button>
    </form>
    <p>Already have an account? <a href="login.php">Log in</a></p>
    <div class="home-link-wrapper">
      <a href="index.php" class="back-to-home">← Back to Home</a>
    </div>

  </div>
</body>
</html>