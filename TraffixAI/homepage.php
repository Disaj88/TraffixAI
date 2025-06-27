<?php
session_start();
include("connect.php")
?>

<?php
session_start();
if (!isset($_SESSION["user_id"])) {
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">    
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomePage</title>
</head>
<body>
    <!-- You can now add your dashboard HTML here -->
<h1>Welcome to your dashboard!</h1>
<a href="logout.php">Logout</a>
    <div> style="text-align:center; padding:15%;">
        <p style="font-size:50px; font-weight:bold;">
        Hello <?php
        if(isset($_SESSION['email'])){
            $email=$_SESSION['email'];
            $query=mysqli_query($conn, "SELECT users.* FROM 'users' WHERE users.email='$email'");
            while($row=mysqli_fetch_array($query)){
                echo $row['username'];
            } 
        }
        ?>
        :
        </p>

</body>
</html>