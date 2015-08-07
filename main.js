app = {
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
    populate: function(){},
    graph: function(data){},
    setCurrentContent: function(content){
      app.ui.currentBodyContent = content;
      Cookies.set("topicname", content.name);
      Cookies.set("topicid", content.tid);
    },
    currentBodyContent: {}
  }
};

$(function(){
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
    $.getJSON("api/random/topic.php",{},function(data){
      app.ui.setCurrentContent(data);
      $('#topicSearch').typeahead('val', data.topicname);
      app.ui.populate();
    });
  };

  app.random.submission = function(e){
    $.getJSON("api/random/submission.php",{topicname: Cookies.get("topicname")},function(data){
      app.ui.setCurrentContent(data);
      app.ui.populate();
    });
  };

  app.ui.populate = function(e){
    if(_(app.ui.currentBodyContent).isEmpty()){
      return app.random.topic();
    }
    var main = $("#main").slideUp(400, function(){
      main.html("<h2 style='text-align:center;'>"+app.ui.currentBodyContent.name+"</h2><p style='text-align:center;'>"+app.ui.currentBodyContent.description+"</p>");
      var submissionDiv = $("<div class='panel panel-default submission'>");
      if(app.ui.currentBodyContent.sid == null){
        submissionDiv.append("<div class='panel-body' style='text-align:center;'>Be the first to <a href='#' data-toggle='modal' data-target='#submissions'>submit a position.</a></div>");
      } else {
        submissionDiv.append("<div class='panel-body'>"+markdown.toHTML(app.ui.currentBodyContent.content)+"</div>");
          if(!Cookies.get("votedFor"+app.ui.currentBodyContent.sid)){
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
              $.post("api/estimate.php", {sid: $this.data("sid"), estimate: parseInt($this.text())}, function(data){
                $this.parent().slideUp(400, function(){
                  $(this).html("<p>Distribution of estimates:</p><svg id='graph"+$this.data("sid")+"'></svg>").slideDown();
                  app.buildGraph($this.data('sid'), data);
                });
                Cookies.set("voteFor"+$this.data("sid"), parseInt($this.text()));
              }, "json");
            });
          } else {
            $.getJSON("api/estimate.php", {sid: app.ui.currentBodyContent.sid}, function(ret){
              submissionDiv.append("<div style='text-align:center;'><p>Distribution of estimates:</p></div><svg id='graph"+app.ui.currentBodyContent.sid+"'></svg>");
              app.ui.graph(app.ui.currentBodyContent.submission.sid, ret);
            });
          }
        main.append(submissionDiv);
      }
      main.slideDown(400);
    });
  };

  app.ui.graph = function(sid, ret){
    var margin = {top: 10, right: 20, bottom: 20, left: 30},
      width = $("svg#graph"+sid).parent().width() - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom,
      x = d3.scale.ordinal().rangeRoundBands([0, width], .1),
      y = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis().scale(x).orient("bottom"),
      yAxis = d3.svg.axis().scale(y).orient("left").ticks(6, "d"),
      svg = d3.select("svg#graph"+sid)
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
      prefetch: 'api/topic.php',
      remote: {
        url: 'api/autocomplete/?topicname=%QUERY',
        wildcard: '%QUERY'
      }
    })
  }).bind('typeahead:select', function(ev, suggestion) {
    Cookies.set("topicname", suggestion);
    app.ui.populate();
  });

  $("#randomTopic").click(app.random.topic);

  $("#essay").keyup(function(){
    $("#submission-word-count").text($(this).val().replace("\s+", " ").split(" ").length);
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

  $("#get-new-position").click(app.random.submission);

  if(Cookies.get("topicname")){
    app.ui.populate();
  } else {
    app.random.topic();
  }
});
