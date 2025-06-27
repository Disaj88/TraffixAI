<?php
// login.php
session_start();

require_once 'connect.php';

if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: index.php");
    exit;
}

$email = $password = "";
$email_err = $password_err = $login_err = "";
$registration_success_message = "";

if (isset($_SESSION['registration_success'])) {
    $registration_success_message = $_SESSION['registration_success'];
    unset($_SESSION['registration_success']);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (empty(trim($_POST["email"]))) {
        $email_err = "Please enter your email.";
    } else {
        $email = trim($_POST["email"]);
    }

    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    if (empty($email_err) && empty($password_err)) {
        // MODIFIED: Select the 'role' column as well
        $sql = "SELECT id, username, password_hash, role FROM users WHERE email = ?";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $param_email);
            $param_email = $email;

            if ($stmt->execute()) {
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    // MODIFIED: Bind the 'role' variable
                    $stmt->bind_result($id, $username, $hashed_password, $role);
                    if ($stmt->fetch()) {
                        if (password_verify($password, $hashed_password)) {
                            session_regenerate_id(true);
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;
                            $_SESSION["role"] = $role; // Store the user's role in the session

                            header("location: index.php");
                            exit;
                        } else {
                            $login_err = "Invalid email or password.";
                        }
                    }
                } else {
                    $login_err = "Invalid email or password.";
                }
            } else {
                $login_err = "Oops! Something went wrong. Please try again later.";
            }

            $stmt->close();
        }
    }
    $conn->close();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link rel="stylesheet" href="css/login-style.css">
  <script type="text/javascript" src="js/login-validation.js" defer></script>
  
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
  <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Poppins:400,700&display=swap" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet" />
  <link href="css/responsive.css" rel="stylesheet" />
</head>
<body>
  <div class="wrapper">
    <h1>Login</h1>

    <?php 
    if (!empty($registration_success_message)) {
        echo '<p class="success-message">' . $registration_success_message . '</p>';
    }
    // PHP server-side login error (e.g., invalid credentials)
    if (!empty($login_err)) {
        echo '<p class="error-message">' . $login_err . '</p>';
    }
    ?>
    
    <!-- This is the paragraph tag for JavaScript client-side error messages -->
    <p id="error-message" class="client-error-message"></p>

    <form id="form" method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
      <div>
        <label for="email-input">
          <span>@</span>
        </label>
        <input type="email" name="email" id="email-input" placeholder="Email" value="<?php echo htmlspecialchars($email); ?>">
        <!-- PHP server-side email validation error -->
        <span class="php-error-message"><?php echo $email_err; ?></span>
      </div>
      <div>
        <label for="password-input">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
        </label>
        <input type="password" name="password" id="password-input" placeholder="Password">
        <!-- PHP server-side password validation error -->
        <span class="php-error-message"><?php echo $password_err; ?></span>
      </div>
      <button type="submit">Login</button>
    </form>
    <p>New here? <a href="signup.php">Create an Account</a></p>
    <div class="home-link-wrapper">
      <a href="index.php" class="back-to-home">← Back to Home</a>
    </div>
  </div>
</body>
</html>