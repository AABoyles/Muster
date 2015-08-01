<!DOCTYPE html>
<html>
    <head>
        <title>Muster</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
          
          #submissions{
            display:none;
          }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" href="#">Muster</a>
            </div>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="#" id="addAPosition" data-toggle="modal" data-target="#submissions">Submit a Position</a></li>
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
                print("<tr id='".$row["id"]."'><td>".$row["content"]."</td><td><a href='#' id='".$row['id']."' class='voteReal btn btn-default btn-primary'>REAL</a> <a href='#' id='".$row['id']."' class='voteFake btn btn-default btn-danger'>FAKE</a></td></tr>");
              }
              
              ?>
              </tbody>
            </table>
          </div>
          <div class="modal fade" id="submissions" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 class="modal-title" id="myModalLabel">Submit a New Position</h4>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <label for="email">Email address</label>
                      <input name="email" id="email" type="email" class="form-control"><br />
                    </div>
                        
                    <div class="form-group">
                      <label for="essay">Position Statement</label>
                      <textarea name="essay" id="essay" class="form-control"></textarea><br />
                    </div>
        
                    <div class="radio">
                      <label>
                        <input type="radio" name="realop" id="realop" value="1" checked>
                        This is my Real Opinion
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="realop" id="fakeop" value="0">
                        This is NOT my Real Opinion
                      </label>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-primary" data-dismiss="modal" id="submit">Submit!</button>
                </div>
              </div>
            </div>
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