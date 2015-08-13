app = {
  get: {},
  topic: function(topicname){},
  estimate: function(){},
  submission: function(){},
  user:{
    isLoggedIn: false,
    login: function(){},
    logout: function(){},
  },
  random:{
    topic: function(e){},
    submission: function(e){},
  },
  ui:{
    populate: function(data){},
    graph: function(data){},
    table: function(data){},
    currentBodyContent: {}
  }
};

window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
  app.get[key] = value;
});

$(function(){
  app.topic = function(topicname){
    $.getJSON("api/topic.php",{topicname: topicname},app.ui.populate);
  }
  
  app.user.login = function(){
    $.post("api/user/login.php", {
      "email": $("#email").val(),
      "password": $("#password").val()
    }, function(ret){
      if(ret.success){
        Cookies.set("uid", ret.uid);
        Cookies.set("email", $("#email").val());
        app.user.isLoggedIn = true;
        $(".while-logged-in").fadeIn();
        $(".while-logged-out").fadeOut();
      }
    });
  }

  app.user.logout = function(){
    $.post("api/logout.php", {
      "email": $("#email").val(),
      "password": $("#password").val()
    }, function(){
      $(".while-logged-out").fadeOut();
      $(".while-logged-in").fadeIn();
    });
  }

  app.random.topic = function(e){
    $.getJSON("api/random/topic.php",{},app.ui.populate);
  };

  app.random.submission = function(e){
    $.getJSON("api/random/submission.php",{topicname: Cookies.get("topicname")},function(data){
      app.ui.populate(data);
    });
  };

  app.ui.populate = function(currentContent){
    if(_(currentContent).isEmpty()){
      if(_(app.ui.currentBodyContent).isEmpty()){
        return app.random.topic();
      }
      return app.ui.populate(app.ui.currentBodyContent);
    }
    app.ui.currentBodyContent = currentContent;
    Cookies.set("topicname", currentContent.name);
    Cookies.set("topicid", currentContent.tid);
    var main = $("#main").slideUp(400, function(){
      main.html("<h2 class='text-center'>"+app.ui.currentBodyContent.name+"</h2><p class='text-center'>"+app.ui.currentBodyContent.description+"</p>");
      var submissionDiv = $("<div class='panel panel-default submission'>");
      if(_(app.ui.currentBodyContent.sid).isNull()){
        submissionDiv.append("<div class='panel-body'><p class='text-center'>Be the first to <a href='#' data-toggle='modal' data-target='#submissions'>submit a position.</a></p></div>");
      } else {
        submissionDiv.append("<div class='panel-body'>"+markdown.toHTML(app.ui.currentBodyContent.content)+"</div>");
        if(!Cookies.get("voteFor"+app.ui.currentBodyContent.sid)){
          submissionDiv.append('<hr /><div class="panel-body estimation">'+
            ' <p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>'+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">1</button> ' +
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">10</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">20</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">30</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">40</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">50</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">60</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">70</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">80</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">90</button> '+
            ' <button data-sid="'+app.ui.currentBodyContent.sid+'" class="estimate btn btn-default">99</button>' +
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
                $.getJSON("api/estimate.php", {sid: app.ui.currentBodyContent.sid}, function(ret){
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
        .append("<div style='text-align:center;'><button id='get-new-position' class='btn btn-default while-logged-in' role='button'>Judge Another Position</button>&nbsp;<button data-toggle='modal' data-target='#submissions' class='btn btn-default while-logged-in' role='button'>Submit Your Position</button></div>")
        .find("#get-new-position").click(app.random.submission);
      main.slideDown();
    });
  };

  app.ui.graph = function(ret){
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
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis);
    svg.selectAll(".bar").data(ret.estimates).enter()
      .append("rect").attr("class", "bar")
      .attr("x", function(d) { return x(d.estimateValue); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(parseInt(d.numberOfEstimates)); })
      .attr("height", function(d) { return height - y(parseInt(d.numberOfEstimates)); });
  };

  $('#topicSearch').typeahead(null, {
    name: 'topics',
    source: new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'api/autocomplete/',
      remote: {
        url: 'api/autocomplete/?topicname=%Q',
        wildcard: '%Q'
      }
    })
  }).bind('typeahead:select', function(ev, suggestion){app.topic(suggestion);});
  
  $("#view-all-topics").click(function(){
    var main = $("#main").slideUp(400, function(){
      $(this).html("<h2>Topics</h2><div class='panel panel-default'><table id='topic-table' class='table responsive table-striped table-hover'><thead><tr><th><input type='text' class='column-header' data-colno='0' placeholder='Name' /></th><th><input type='integer' class='column-header' data-colno='2' placeholder='Submissions' /></th></thead></table></div>");
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
      $(this)
        .append('<div style="text-align:center;"><button id="addATopic" data-toggle="modal" data-target="#topics" class="btn btn-default while-logged-in" role="button">Create a New Topic</button></div>')
        .slideDown();
    })
    
  });

  $("#randomTopic").click(app.random.topic);

  $("#essay").keyup(function(){
    $("#submission-word-count").text($(this).val().replace("\s+", " ").trim().split(" ").length);
  });

  $("#submitTopic").click(function(){
    if(!Cookies.get("email")){
      app.user.addUser($("#topicemail").val());
    }
    $.post("api/topic.php", {
      name: $("#topicname").val(),
      description: $("#topicdescription").val(),
      uid: Cookies.get("uid")
    }, function(data){
      Cookies.set({
        "topicid": parseInt(data.tid),
        "topicname": $("#topicname").val()
      });
      app.ui.populate();
    }, "json");
  });

  $("#submitPosition").click(function(){
    if(parseInt($("#submission-word-count").text()) < 100){
      $("#submission-word-count").addClass("invalid");
    }
    $.post("api/submission.php", {
      topicid: Cookies.get("topicid"),
      essay: $("#essay").val(),
      realop: $("#realop").is(":checked"),
      uid: Cookies.get("uid")
    }, app.ui.populate, "json");
  });

  if(Cookies.get("topicname")){
    app.ui.populate();
  } else {
    app.random.topic();
  }
});
