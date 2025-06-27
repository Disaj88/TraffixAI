<?php
// index.php
session_start();

if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="keywords" content="" />
  <meta name="description" content="" />
  <meta name="author" content="" />

  <title>TraffixAI</title>

  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
  <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Poppins:400,700&display=swap" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet" />
  <link href="css/responsive.css" rel="stylesheet" />

  <style>
    .welcome-message {
        margin-right: 20px;
        font-weight: bold;
        color: #f7941d; /* Example color, match your theme */
    }
    .logout-btn {
        background-color: #dc3545; /* Bootstrap danger color */
        color: white;
        padding: 8px 15px;
        border-radius: 5px;
        text-decoration: none;
        margin-left: 10px;
    }
    .logout-btn:hover {
        background-color: #c82333;
    }
  </style>
</head>

<body>
  <div class="hero_area">
    <header class="header_section">
      <div class="container-fluid">
        <nav class="navbar navbar-expand-lg custom_nav-container pt-3">
          <a class="navbar-brand" href="index.php">
            <span>
              TraffixAI
            </span>
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <div class="d-flex ml-auto flex-column flex-lg-row align-items-center">
                            <ul class="navbar-nav">
                                <li class="nav-item active">
                                    <a class="nav-link" href="index.php">Home <span class="sr-only">(current)</span></a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="about.php"> About </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="do.php"> What we do </a>
                                </li>
                                <?php if (isset($_SESSION["role"]) && $_SESSION["role"] === 'admin'): ?>
                                    <li class="nav-item">
                                        <!-- This will be the link to your new admin dashboard -->
                                        <a class="nav-link" href="monitor_dashboard.php"> Monitor </a>
                                    </li>
                                <?php endif; ?>
                                <li class="nav-item">
                                    <a class="nav-link" href="contact.php">Contact us</a>
                                </li>
                            </ul>
                            <div class="user_option">
                                <?php if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true): ?>
                                    <span class="welcome-message">Welcome, <b><?php echo htmlspecialchars($_SESSION["username"]); ?></b>!</span>
                                    <a href="logout.php" class="logout-btn">Sign Out</a>
                                <?php else: ?>
                                    <a href="login.php">
                                        <img src="images/user.png" alt="User Icon">
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    <section class="slider_section position-relative">
      <div class="container">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="row">
                <div class="col">
                  <div class="detail-box">
                    <div>
                      <h2>
                        welcome to
                      </h2>
                      <h1>
                        TraffixAI
                      </h1>
                      <p>
                        Fixing Traffic With Intelligence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div class="row">
                <div class="col">
                  <div class="detail-box">
                    <div>
                      <h2>
                        Join us
                      </h2>
                      <h1>
                        In Reinventing Urban Traffic
                      </h1>
                      <p>
                        Say goodbye to outdated traffic systems. Our AI-powered, sensor-driven platform transforms intersections into intelligent networks—making streets safer, faster, and smarter for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="carousel-item">
              <div class="row">
                <div class="col">
                  <div class="detail-box">
                    <div>
                      <h2>
                        DRIVE THE NEXT WAVE OF CITY INTELLIGENCE
                      </h2>
                      <h1>
                        TURN INTERSECTIONS INTO THINKING MACHINES
                      </h1>
                      <p>
                        From traffic detection to adaptive signals, our system uses AI to make roads more efficient, responsive, and human-aware—because cities deserve smarter infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>


  <section class="do_section layout_padding">
    <div class="container">
      <div class="heading_container">
        <h2>
          What we do
        </h2>
        <p>
          We design and build AI-powered smart traffic light systems that adapt in real-time to changing urban conditions. Using sensor data from ultrasonic vehicle detectors and pedestrian buttons, our system intelligently adjusts traffic signals and crosswalk timings—improving flow, reducing wait times, and enhancing road safety.
          Our architecture combines:
        </p>
      </div>
      <div class="do_container">
        <div class="box arrow-start arrow_bg">
          <div class="img-box">
            <img src="images/d-1.png" alt="">
          </div>
          <div class="detail-box">
            <h6>
              AI Decision Engine
            </h6>
          </div>
        </div>
        <div class="box arrow-middle arrow_bg">
          <div class="img-box">
            <img src="images/d-2.png" alt="">
          </div>
          <div class="detail-box">
            <h6>
              Vehicle Detection
            </h6>
          </div>
        </div>
        <div class="box arrow-middle arrow_bg">
          <div class="img-box">
            <img src="images/d-3.png" alt="">
          </div>
          <div class="detail-box">
            <h6>
              Adaptive Crosswalks
            </h6>
          </div>
        </div>
        <div class="box arrow-end arrow_bg">
          <div class="img-box">
            <img src="images/d-4.png" alt="">
          </div>
          <div class="detail-box">
            <h6>
              Node-RED Dashboard
            </h6>
          </div>
        </div>
        <div class="box ">
          <div class="img-box">
            <img src="images/d-5.png" alt="">
          </div>
          <div class="detail-box">
            <h6>
              Data Optimized Timing
            </h6>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="who_section ">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <div class="img-box">
            <img src="images/WWA.jpeg" alt="">
          </div>
        </div>
        <div class="col-md-7">
          <div class="detail-box">
            <div class="heading_container">
              <h2>
                WHO WE ARE?
              </h2>
            </div>
            <p>
              We are Team Trinity Syntax, a group of 5 students from Trinity College Kandy, developing an innovative traffic light system aimed at transforming traffic management in Kandy, Sri Lanka. The system will be based on smart, adaptive, and AI-driven algorithms to optimize traffic flow, reduce congestion, and improve pedestrian safety. Our goal is to improve the quality of life for Kandy's residents, enhance road safety, and contribute to environmental sustainability by minimizing traffic delays and fuel consumption.After out first implementation stage we plan on scaling to even more areas!
            </p>
            <div>
              <a href="">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="work_section layout_padding">
    <div class="container">
      <div class="heading_container">
        <h2>
          A Glimpse Behind The Scenes
        </h2>
      </div>
      <div class="work_container layout_padding2">
        <div class="box b-1">
          <img src="images/BTHS1.png" alt="">
        </div>
        <div class="box b-2">
          <img src="images/BTHS2.jpg" alt="">
        </div>
        <div class="box b-3">
          <img src="images/BTHS3.jpg" alt="">
        </div>
        <div class="box b-4">
          <img src="images/BTHS4.jpg" alt="">
        </div>
      </div>
    </div>
  </section>
  <section class="client_section">
    <div class="container">
      <div class="heading_container">
        <h2>
          WHAT CUSTOMERS SAY
        </h2>
      </div>
      <div class="carousel-wrap ">
        <div class="owl-carousel">
          <div class="item">
            <div class="box">
              <div class="img-box">
                <img src="images/c-1.png" alt="">
              </div>
              <div class="detail-box">
                <h5>
                  Tempor incididunt <br>
                  <span>
                    Dipiscing elit
                  </span>
                </h5>
                <img src="images/quote.png" alt="">
                <p>
                  Dipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                </p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="box">
              <div class="img-box">
                <img src="images/c-2.png" alt="">
              </div>
              <div class="detail-box">
                <h5>
                  Tempor incididunt <br>
                  <span>
                    Dipiscing elit
                  </span>
                </h5>
                <img src="images/quote.png" alt="">
                <p>
                  Dipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                </p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="box">
              <div class="img-box">
                <img src="images/c-3.png" alt="">
              </div>
              <div class="detail-box">
                <h5>
                  Tempor incididunt <br>
                  <span>
                    Dipiscing elit
                  </span>
                </h5>
                <img src="images/quote.png" alt="">
                <p>
                  Dipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="target_section layout_padding2">
    <div class="container">
      <div class="row">
        <div class="col-md-3 col-sm-6">
          <div class="detail-box">
            <h2>
              5+
            </h2>
            <h5>
              Partnerships
            </h5>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="detail-box">
            <h2>
              4+
            </h2>
            <h5>
              Junctions Secured
            </h5>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="detail-box">
            <h2>
              10000+
            </h2>
            <h5>
              Satisfied Users
            </h5>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="detail-box">
            <h2>
              5+
            </h2>
            <h5>
              Developers
            </h5>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="contact_section layout_padding">
    <div class="container">
      <div class="heading_container">
        <h2>
          Get In Touch
        </h2>
      </div>
      <div class="">
        <div class="">
          <div class="row">
            <div class="col-md-9 mx-auto">
              <div class="contact-form">
                <form action="">
                  <div>
                    <input type="text" placeholder="Full Name ">
                  </div>
                  <div>
                    <input type="text" placeholder="Phone Number">
                  </div>
                  <div>
                    <input type="email" placeholder="Email Address">
                  </div>
                  <div>
                    <input type="text" placeholder="Message" class="input_message">
                  </div>
                  <div class="d-flex justify-content-center">
                    <button type="submit" class="btn_on-hover">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="info_section ">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="info_contact">
            <h5>
              About Us
            </h5>
            <div>
              <div class="img-box">
                <img src="images/location-white.png" width="18px" alt="">
              </div>
              <p>
                Kandy
              </p>
            </div>
            <div>
              <div class="img-box">
                <img src="images/telephone-white.png" width="12px" alt="">
              </div>
              <p>
                +94 71 780 4730
              </p>
            </div>
            <div>
              <div class="img-box">
                <img src="images/envelope-white.png" width="18px" alt="">
              </div>
              <p>
                msmfairooz62@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="info_info">
            <h5>
              Information
            </h5>
            <p> <justify>
              We design intelligent, AI-driven traffic light systems that adapt in real-time using sensor data to reduce congestion, enhance pedestrian safety, and improve urban mobility—starting with Kandy, Sri Lanka.
            </justify>
            </p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="info_insta">
            <h5>
              Instagram
            </h5>
            <div class="insta_container">
              <div>
                <a href="">
                  <div class="insta-box b-1">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
                <a href="">
                  <div class="insta-box b-2">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
              </div>

              <div>
                <a href="">
                  <div class="insta-box b-3">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
                <a href="">
                  <div class="insta-box b-4">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
              </div>
              <div>
                <a href="">
                  <div class="insta-box b-3">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
                <a href="">
                  <div class="insta-box b-4">
                    <img src="images/insta.png" alt="">
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="info_form ">
            <h5>
              Newsletter
            </h5>
            <form action="">
              <input type="email" placeholder="Enter your email">
              <button>
                Subscribe
              </button>
            </form>
            <div class="social_box">
              <a href="">
                <img src="images/fb.png" alt="">
              </a>
              <a href="">
                <img src="images/twitter.png" alt="">
              </a>
              <a href="">
                <img src="images/linkedin.png" alt="">
              </a>
              <a href="">
                <img src="images/youtube.png" alt="">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="container-fluid footer_section">
    <p>
      &copy; 2025 All Rights Reserved By
      <a href="https://html.design/">Team Trinity Syntax</a>
    </p>
  </section>
  <script type="text/javascript" src="js/jquery-3.4.1.min.js"></script>
  <script type="text/javascript" src="js/bootstrap.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js">
  </script>

  <script type="text/javascript">
    $(".owl-carousel").owlCarousel({
      loop: true,
      margin: 0,
      navText: [],
      center: true,
      autoplay: true,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1
        },
        1000: {
          items: 3
        }
      }
    });
  </script>
  </body>

</html>