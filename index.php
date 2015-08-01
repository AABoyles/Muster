<!DOCTYPE html>
<html>
    <head>
        <title>Muster</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css" type="text/css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap-theme.min.css" type="text/css" />
        <style>
          #future { 
            color: orange !important; 
          }
          
          #census {
            color: black !important;
          }
          
          #future, #census {
            font-family: 'Roboto', sans-serif;
            font-weight: bold;
            font-size: 24px;
          }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <a class="navbar-brand" href="#">Muster</a>
            </div>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="submit">Submit a Position</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div id="main" class="row">
          <div class="col-md-10 col-md-offset-1">
          <table class="table">
            <thead><tr><th>Position</th><th>Vote</th></tr></thead>
            <tbody>
            <?php 
            require("creds.php");

            $results = mysqli_query($db, "SELECT id, content FROM `submission` ORDER BY RAND() LIMIT 10");
            
            while ($row = mysqli_fetch_assoc($results)) {
              print("<tr id='".$row["id"]."'><td>".$row["content"]."</td><td><a href='#' id='".$row['id']."' class='voteReal'>REAL</a><br /><a href='#' id='".$row['id']."' class='voteFake'>FAKE</a></td></tr>");
            }
            
            ?>
            </tbody>
          </table>
          </div>
        </div>
        <nav class="navbar navbar-default navbar-fixed-bottom">
          <div class="container">
            <ul class="nav navbar-nav navbar-right">
              <li><a href="https://futurecensus.github.io">by <span id="future">Future</span><span id="census">Census</span></a></li>
            </ul>
          </div>
        </nav>
    </body>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="main.js"></script>
</html>