app = {
  populateBody: function(){},
  addUser: function(){},
  buildGraph: function(data){},
  randomTopic: function(e){}
};

$(function(){
  app.randomTopic = function(e){
    $.getJSON("api/random/topic.php",{},function(data){
      Cookies.set("topicname", data.topicname);
      Cookies.set("topicid", data.topicid);
      $('#topicSearch').typeahead('val', data.topicname);
      app.populateBody();
    });
  };
  
  app.populateBody = function(e){
    $.getJSON("api/submission.php", {topicname: Cookies.get("topicname")}, function(ret){
      var main = $("#main").slideUp(400, function(){
        main.html("<h2 style='text-align:center;'>"+ret.topic.name+"</h2>"+
          "<p style='text-align:center;'>"+ret.topic.description+"</p>");
        Cookies.set("topicname", ret.topic.name);
        Cookies.set("topicid", ret.topic.tid);
        if(ret.submissions.length == 0){
          main.append("<div class='panel panel-default submission'><p>Be the first to submit a position!</p></div>");
        } else {
          $.each(ret.submissions, function(i, el){
            var submissionDiv = $("<div id='submission"+el.sid+"' class='panel panel-default submission'>").append("<div class='panel-body'>"+markdown.toHTML(el.content)+"</div>");
              if(!Cookies.get("votedFor"+el.sid)){
                //TODO: Move this to a Template
                submissionDiv.append('<div class="panel-body estimation">'+
                ' <p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>'+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">1</button> ' +
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">10</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">20</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">30</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">40</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">50</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">60</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">70</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">80</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">90</button> '+
                ' <button data-sid="'+el.sid+'" class="estimate btn btn-default">99</button>' +
                '</div>').find(".estimate").click(function(){
                  var $this = $(this);
                  $.post("api/estimate.php", {sid: $this.data("sid"), estimate: parseInt($this.text())}, function(ret){
                    $this.parent().slideUp(400, function(){
                      $(this).html("<p>Distribution of estimates:</p><svg id='graph"+$this.data("sid")+"'></svg>").slideDown();
                      app.buildGraph($this.data('sid'), ret);
                    });
                    Cookies.set("voteFor"+$this.data("sid"), parseInt($this.text()));
                  }, "json");
                });
              } else {
                $.getJSON("api/estimate.php", {sid: el.sid}, function(ret){
                  submissionDiv.append("<div style='text-align:center;'><p>Distribution of estimates:</p></div><svg id='graph"+el.sid+"'></svg>");
                  app.buildGraph(el.sid, ret);
                });
              }
            main.append(submissionDiv);
          });
        }
        main.append("<div style='text-align:center;'><button data-toggle='modal' data-target='#submissions' class='btn btn-default addAPosition' role='button'>Submit Your Position</button></div>").slideDown(400);
      });
    });
  };

  app.addUser = function(email){
    Cookies.set("email", email);
    var rawpw = Array(128);
    for(var i=0; i<128; i++){
      rawpw[i] = String.fromCharCode(32+Math.round(Math.random()*94));
    }
    var pw = rawpw.join("");
    Cookies.set("password", pw);
    $.post("api/user.php", {
      email: email,
      password: pw
    }, function(ret){
      if(ret.success){
        Cookies.set("uid", ret.uid);
      }
    }, "json");
    $(".emailwrapper").hide();
  };

  app.buildGraph = function(sid, ret){
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
  
  $("#randomTopic").click(app.randomTopic);

  $("#submitTopic").click(function(){
    if(!Cookies.get("email")){
      app.addUser($("#topicemail").val());
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
      app.populateBody();
    }, "json");
  });

  $("#submitPosition").click(function(){
    if(!Cookies.get("email")){
      app.addUser($("#email").val());
    }
    $.post("api/submission.php", {
      topicid: Cookies.get("topicid"),
      essay: $("#essay").val(),
      realop: $("#realop").is(":checked"),
      uid: Cookies.get("uid")
    }, app.populateBody, "json");
  });

  $('#topicSearch').typeahead(null, {
    name: 'topics',
    source: new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: 'api/topic.php',
      remote: {
        url: 'api/topic.php?topicname=%QUERY',
        wildcard: '%QUERY'
      }
    })
  }).bind('typeahead:select', function(ev, suggestion) {
    Cookies.set("topicname", suggestion);
    app.populateBody();
  });


  if(Cookies.get("email")){
    $(".emailwrapper").hide();
  }

  app.randomTopic();
});
