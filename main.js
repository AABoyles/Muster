app = {
  populateBody: function(){},
  addUser: function(){},
  buildGraph: function(data){}
};

$(function(){

    app.populateBody = function(e){
        $.getJSON("api/submission.php", {
            "cid": $("#category").val()
        }, function(ret){
            var main = $("#main").slideUp(400, function(){
                main.empty();
                var lastName = "";
                _(ret).each(function(el){
                    if(lastName != el.name){
                        main.append("<h2 style='text-align:center;'>"+el.name+'</h2>'+
                          "<div style='width:100%;text-align:center;margin-bottom:15px;'>"+
                          "  <button data-toggle='modal' data-target='#submissions' class='btn btn-default addAPosition' role='button'>Submit Your Position</button>"+
                          "</div><hr />");
                    }
                    main.append("<blockquote>"+el.content+"</blockquote>");
                    if(!Cookies.get("votedFor"+el.sid)){
                      main.append('<div style="text-align:center;">'+
                        '<p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>'+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">1</button> ' +
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">10</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">20</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">30</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">40</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">50</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">60</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">70</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">80</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">90</button> '+
                        '<button data-sid="'+el.sid+'" class="estimate btn btn-default">99</button>' +
                        '</div><hr />');
                      $(".estimate").click(function(){
                        var $this = $(this);
                        $.post("api/estimate.php", {sid: $this.data("sid"), estimate: parseInt($this.text())}, function(ret){
                            $this.parent().slideUp(400, function(){
                                $(this).html("<p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>")
                                  .append("<svg id='graph"+$this.data("sid")+"'></svg>")
                                  .slideDown();
                                  app.buildGraph($this.data('sid'), ret);
                            });
                            Cookies.set("votedFor"+$this.data("sid"), true);
                        }, "json");
                      });
                    } else {
                      $.getJSON("api/estimate.php", {sid: el.sid}, function(ret){
                        $('<div style="text-align:center;"><p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p></div>')
                          .append('<svg id="graph'+el.sid+'"></svg>')
                          .append("<hr />")
                          .appendTo(main);
                          app.buildGraph(el.sid, ret);
                      });
                    }
                });
                main.slideDown(400);
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
    };

    app.buildGraph = function(sid, ret){
      var parent = $("svg#graph"+sid).parent(),
          margin = {top: 10, right: 20, bottom: 20, left: 30},
          width = parent.width() - margin.left - margin.right,
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

    $("#category").change(app.populateBody);

    $("#addATopic").click(function(){
        if(Cookies.get("email")){
            $("#topicemailwrapper").hide();
        }
    });

    $(".addAPosition").click(function(){
        if(Cookies.get("email")){
            $("#submissionemailwrapper").hide();
        }
    });

    $("#submitTopic").click(function(){
        if(!Cookies.get("email")){
            app.addUser($("#topicemail").val());
        }
        $.post("api/topic.php", {
            name:$("#topicname").val(),
            description:$("#topicdescription").is(":checked")?1:0
        }, app.populateBody, "json");
    });

    $("#submitPosition").click(function(){
        if(!Cookies.get("email")){
            app.addUser($("#email").val());
        }
        $.post("api/submission.php", {
            essay:$("#essay").val(),
            realop:$("#realop").is(":checked")?1:0
        }, function(ret){}, "json");
    });

    app.populateBody();
});
