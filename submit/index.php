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
        </style>
    </head>
    <body>
        <nav class="navbar navbar-default">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" href="/">Muster</a>
            </div>
              <ul class="nav navbar-nav navbar-right">
                <li><a href="submit">Submit a Position</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div id="main" class="container-fluid">
          <div class="row">
            <div class="col-md-8 col-md-offset-2">
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

                <span class="input-group-btn" style="text-align:center;"><button id="submit-position" class="btn btn-default">Submit</button></span>

              </form>
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
    <script src="../main.js"></script>
</html>