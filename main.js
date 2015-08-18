$(function(){

  if(Cookies.get("uid")){
    $("#email").val(Cookies.get("email"));
    $("#password").val(Cookies.get("password"));
    $(".while-logged-out").hide();
    $(".while-logged-in").show();
    $("#flying-rules").html(".while-logged-out{display:none;}");
  } else {
    $(".while-logged-in").hide();
    $(".while-logged-out").show();
    $("#flying-rules").html(".while-logged-in{display:none;}");
  }

  app = {
    get: (function(){
      var resp = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        resp[key] = value;
      });
      return resp;
    })(),
    topic: function(topicname){$.getJSON("api/topic.php",{topicname: topicname},app.ui.show.current.submission);},
    estimate: function(){},
    submission: function(){},
    user:{
      login: function(e){
        $.post("api/user/login.php", {
          "email": $("#email").val(),
          "password": $("#password").val()
        }, function(ret){
          if(ret.success){
            alertify.success("Logged In!");
            Cookies.set("uid", ret.uid);
            Cookies.set("email", $("#email").val());
            Cookies.set("password", $("#password").val());
            $(".while-logged-out").hide();
            $(".while-logged-in").fadeIn();
            $("#flying-rules").html(".while-logged-out{display:none;}");
          } else {
            alertify.error(ret.message);
          }
        }, "json");
      },
      logout: function(){
        $.post("api/user/logout.php", {
          "email": Cookies.get("email"),
          "password": Cookies.get("password")
        }, function(){
          $("#email").val("");
          $("#password").val("");
          Cookies.remove("uid");
          Cookies.remove("email");
          Cookies.remove("password");
          $(".while-logged-out").fadeIn();
          $(".while-logged-in").hide();
          $("#flying-rules").html(".while-logged-in{display:none;}");
        });
      }
    },
    ui:{
      show: {
        all: {
          topics: function(){
            $("#main").slideUp(400, function(){
              $(this).html("<h2>Topics</h2><div class='panel panel-default'><table id='topic-table' class='table responsive table-striped table-hover'><thead><tr><th><input type='text' class='column-header' data-colno='0' placeholder='Name' /></th><th><input type='integer' class='column-header' data-colno='2' placeholder='Submissions' /></th></tr></thead></table></div>");
              var table = $(this).find("#topic-table").DataTable({
                ajax: "api/all/topics.php",
                dom: "t",
                responsive: true
              });
        
              table.columns().eq(0).each(function (colIdx) {
                $('input', table.column(colIdx).header()).on('keyup keydown change', function(){
                  table.column(colIdx).search($(this).val(), true, false).draw()
                }).click(function(evt){
                  evt.preventDefault();
                  evt.stopPropagation();
                  return false;
                });
              });
        
              $("#topic-table").on('draw.dt', function(){
                $(this).find("tr td:first-child").click(function(){app.topic($(this).text().trim());});
              });
        
              var div = $('<div style="text-align:center;">');
              $('<button id="randomTopic" class="btn btn-default" role="button">Get a Random Topic</button>')
                .click(app.ui.show.random.topic)
                .appendTo(div);
              $('<button id="addATopic" data-toggle="modal" data-target="#topics" class="btn btn-default while-logged-in" role="button">Create a New Topic</button>')
                .appendTo(div);
              $(this)
                .append(div)
                .slideDown();
            });
          }
        },
        my: {
          topics: function(){
            $("#main").slideUp(400, function(){
              $(this).html("<h2>My Topics</h2><div class='panel panel-default'><table id='topic-table' class='table responsive table-striped table-hover'><thead><tr><th><input type='text' class='column-header' data-colno='0' placeholder='Name' /></th><th><input type='integer' class='column-header' data-colno='2' placeholder='Submissions' /></th></tr></thead></table></div>");
              var table = $(this).find("#topic-table").DataTable({
                ajax: "api/user/topics.php",
                dom: "t",
                responsive: true
              });
        
              table.columns().eq(0).each(function (colIdx) {
                $('input', table.column(colIdx).header()).on('keyup keydown change', function(){
                  table.column(colIdx).search($(this).val(), true, false).draw()
                }).click(function(evt){
                  evt.preventDefault();
                  evt.stopPropagation();
                  return false;
                });
              });
        
              $("#topic-table").on('draw.dt', function(){
                $(this).find("tr td:first-child").click(function(){app.topic($(this).text().trim());});
              });
        
              var div = $('<div style="text-align:center;">');
              $('<button id="randomTopic" class="btn btn-default" role="button">Get a Random Topic</button>')
                .click(app.ui.show.random.topic)
                .appendTo(div);
              $('<button id="addATopic" data-toggle="modal" data-target="#topics" class="btn btn-default while-logged-in" role="button">Create a New Topic</button>')
                .appendTo(div);
              $(this)
                .append(div)
                .slideDown();
            });
          },
          submissions: function(){
            $("#main").slideUp(400, function(){
              $(this).html("<h2>My Submissions</h2><div class='panel panel-default'><table id='submissions-table' class='table responsive table-striped table-hover'><thead><tr><th><input type='text' class='column-header' data-colno='0' placeholder='Content' /></th><th><input type='integer' class='column-header' data-colno='1' placeholder='Estimates' /></th></tr></thead></table></div>");
              var table = $(this).find("#submissions-table").DataTable({
                ajax: "api/user/submissions.php",
                dom: "t",
                responsive: true
              });

              table.columns().eq(0).each(function (colIdx) {
                $('input', table.column(colIdx).header()).on('keyup keydown change', function(){
                  table.column(colIdx).search($(this).val(), true, false).draw()
                }).click(function(evt){
                  evt.preventDefault();
                  evt.stopPropagation();
                  return false;
                });
              });
        
              $("#topic-table").on('draw.dt', function(){
                $(this).find("tr td:first-child").click(function(){app.topic($(this).text().trim());});
              });

              $(this)
                .slideDown();
            });
          },
          estimates: function(){}
        },
        current: {
          submission: function(currentContent){
            if(_(currentContent).isEmpty()){
              if(!Cookies.get(currentContent)){
                return app.random.topic();
              }
              currentContent = JSON.parse(Cookies.get("currentContent"));
            }
            Cookies.set("currentContent", currentContent);
            var main = $("#main").slideUp(400, function(){
              main.html("<h2 class='text-center'>"+currentContent.name+"</h2><p class='text-center'>"+currentContent.description+"</p>");
              var submissionDiv = $("<div class='panel panel-default submission'></div>");
              if(_(currentContent.sid).isNull()){
                submissionDiv.append("<div class='panel-body'><p class='text-center'>Be the first to <a href='#' data-toggle='modal' data-target='#submissions'>submit a position.</a></p></div>");
              } else {
                submissionDiv.append("<div class='panel-body'>"+markdown.toHTML(currentContent.content)+"</div>");
                if(!Cookies.get("voteFor"+currentContent.sid)){
                  submissionDiv.append('<hr /><div class="panel-body estimation">'+
                    ' <p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>'+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">1</button> ' +
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">10</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">20</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">30</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">40</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">50</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">60</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">70</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">80</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">90</button> '+
                    ' <button data-sid="'+currentContent.sid+'" class="estimate btn btn-default">99</button>' +
                    '</div>').find(".estimate").click(function(){
                      var $this = $(this);
                      var estimate = parseInt($this.text());
                      Cookies.set("voteFor"+$this.data("sid"), estimate);
                      $.post("api/estimate.php", {sid: $this.data("sid"), estimate: estimate}, function(ret){
                        $this.parent().slideUp(400, function(){
                          var exclaim = "Good Job!";
                          var cclass = "alert-success";
                          if((estimate > 50 & ret.isReal != "1") | (estimate < 50 & ret.isReal == "1")){
                              exclaim = "Oh, bummer.";
                              cclass = "alert-danger";
                          }
                          var belief = "<div class='alert " + cclass + "' role='alert'><p class='text-center'><strong>"+exclaim+"</strong> This author does not believe this.</p></div>";
                          if(ret.isReal=="1"){
                            var belief = "<div class='alert " + cclass + "' role='alert'><p class='text-center'><strong>"+exclaim+"</strong> This author holds this belief honestly.</p></div>";
                          }
                          $(this)
                            .html("<p class='text-center'>Distribution of estimates:</p><svg id='graph'></svg>" + belief)
                            .slideDown();
                          app.ui.graph(ret);
                        });
                      }, "json");
                    });
                } else {
                  submissionDiv
                  .append('<hr /><div class="panel-body estimation"><p class="text-center">You\'ve already judged this Submission.</p><button class="btn btn-default">Show Results</button></div>')
                  .find("button").click(function(){
                    $this = $(this);
                    $.getJSON("api/estimate.php", {sid: currentContent.sid}, function(ret){
                      $this.parent().slideUp(400, function(){
                        var belief = "<div class='alert alert-info' role='alert'><p class='text-center'>This author does not believe this.</p></div>";
                        if(ret.isReal=="1"){
                          belief = "<div class='alert alert-info' role='alert'><p class='text-center'>This author holds this belief honestly.</p></div>";
                        }
                        $(this)
                          .html("<p class='text-center'>Distribution of estimates:</p><svg id='graph'></svg>"+belief)
                          .slideDown();
                          app.ui.graph(ret);
                        });
                      });
                  });
                }
              }
              main
                .append(submissionDiv)
                .append("<div style='text-align:center;'><button id='get-new-position' class='btn btn-default' role='button'>Judge Another Position</button>&nbsp;<button data-toggle='modal' data-target='#submissions' class='btn btn-default while-logged-in' role='button'>Submit Your Position</button></div>")
                .find("#get-new-position").click(app.ui.show.random.submission);
              main.slideDown();
            });
          }
        },
        random:{
          topic: function(e){$.getJSON("api/random/topic.php",{},app.ui.show.current.submission);},
          submission: function(e){$.getJSON("api/random/submission.php",{topicname: JSON.parse(Cookies.get("currentContent")).name},app.ui.show.current.submission);}
        }
      },
      graph: function(ret){
        var margin = {top: 10, right: 20, bottom: 20, left: 30},
          width = $("svg#graph").parent().width() - margin.left - margin.right,
          height = 100 - margin.top - margin.bottom,
          x = d3.scale.ordinal().rangeRoundBands([0, width], .1),
          y = d3.scale.linear().range([height, 0]),
          xAxis = d3.svg.axis().scale(x).orient("bottom"),
          yAxis = d3.svg.axis().scale(y).orient("left").ticks(6, "d"),
          svg = d3.select("svg#graph")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        x.domain(["1","10","20","30","40","50","60","70","80","90","99"]);
        y.domain([0, d3.max(ret.estimates, function(d) { return parseInt(d.numberOfEstimates); })]);
        svg
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
        svg
          .append("g")
          .attr("class", "y axis")
          .call(yAxis);
        svg
          .selectAll(".bar")
          .data(ret.estimates)
          .enter()
          .append("rect").attr("class", "bar")
          .attr("x", function(d) { return x(d.estimateValue); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(parseInt(d.numberOfEstimates)); })
          .attr("height", function(d) { return height - y(parseInt(d.numberOfEstimates)); });
      },
      table: function(data){}
    }
  };

  //...And all the UI Stuff.
  
  //One liners you might be able to bake into the Markup without much fuss...
  $("#login-button").click(app.user.login);
  $("#logout-button").click(app.user.logout);
  $("#view-all-topics").click(app.ui.show.all.topics);
  $("#my-topics-link").click(app.ui.show.my.topics);
  $("#my-submissions-link").click(app.ui.show.my.submissions);

  $("#essay").keydown(function(){
    var wordcount = $(this)
      .val()
      .replace(/\s+/, " ")
      .trim()
      .split(" ")
      .length
    $("#submission-word-count").text(wordcount);
  });

  $("#submitTopic").click(function(){
    $.post("api/topic.php", {
      name: $("#topicname").val(),
      description: $("#topicdescription").val(),
      uid: Cookies.get("uid")
    }, app.ui.show.current.submission, "json");
  });

  $("#submitPosition").click(function(){
    if(parseInt($("#submission-word-count").text()) < 100){
      alertify.error("Your submission doesn't meet the minimum word count!");
    } else {
      $.post("api/submission.php", {
        topicid: JSON.parse(Cookies.get("currentContent")).tid,
        content: $("#essay").val(),
        realop: $("#realop").is(":checked"),
        userid: Cookies.get("uid")
      }, app.ui.show.current.submission, "json");
    }
  });

  if(Cookies.get("currentContent")){
    app.ui.show.current.submission();
  } else {
    app.ui.show.random.topic();
  }

});
