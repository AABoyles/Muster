app = {
  populateBody: function(){},
  addUser: function(){}
};

$(function(){

    app.populateBody = function(e){
        $.getJSON("api/submission.php", {
            "cid": $("#category").val()
        }, function(ret){
            var main = $("#main").fadeOut(400, function(){
                main.empty();
                var lastName = "";
                _(ret).each(function(el){
                    if(lastName != el.name){
                        main.append("<h2 style='text-align:center;'>"+el.name+'</h2><div style="width:100%;text-align:center;margin-bottom:15px;"><button data-toggle="modal" data-target="#submissions" class="btn btn-default addAPosition" role="button">Submit Your Position</button></div><hr />');
                    }
                    main.append("<blockquote>"+el.content+'</blockquote><div style="text-align:center;">'+
                        '<p>How confident are you (in percentages) that the author <b>actually</b> holds this opinion?</p>'+
                        '<button id="vote'+el.sid+'isreal" class="vote btn btn-default">1</button> ' +
                        '<button id="vote'+el.sid+'isreal" class="vote btn btn-default">10</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">20</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">30</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">40</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">50</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">60</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">70</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">80</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">90</button> '+
                        '<button id="vote'+el.sid+'isfake" class="vote btn btn-default">99</button>' +
                        '</div><hr />');
                });
                main.fadeIn(400);
            });
        });
        $(".vote").click(function(){
            var $this = $(this);
            if(Cookies.get("votedFor"+this.id)){
                $.getJSON("api/estimate.php", {id: this.id, real: $this.hasClass("voteReal")}, function(ret){
                    var newhtml =
                        "Votes for Real: " + ret["votesReal"] + "<br />" +
                        "Votes for Fake: " + ret["votesFake"] + "<br />" +
                        "Was it Real? " + (ret["isReal"]=="1" ? "YUP." : "NOPE.");
                    $this.parent().fadeOut(400, function(){
                        $(this).html(newhtml).fadeIn();
                    });
                });
            } else {
                $.post("api/estimate.php", {id: this.id, real: $this.hasClass("voteReal")}, function(ret){
                    var newhtml =
                        "Votes for Real: " + ret["votesReal"] + "<br />" +
                        "Votes for Fake: " + ret["votesFake"] + "<br />" +
                        "Was it Real? " + (ret["isReal"]=="1" ? "YUP." : "NOPE.");
                    $this.parent().fadeOut(400, function(){
                        $(this).html(newhtml).fadeIn();
                    });
                    Cookies.set("votedFor"+this.id, true);
                    Cookies.set("vote"+this.id, $this.hasClass("voteReal"));
                }, "json");
            }
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
            addUser($("#topicemail").val());
        }
        $.post("api/topic.php", {
            name:$("#topicname").val(),
            description:$("#topicdescription").is(":checked")?1:0
        }, populateBody, "json");
    });

    $("#submitPosition").click(function(){
        if(!Cookies.get("email")){
            addUser($("#email").val());
        }
        $.post("api/submission.php", {
            essay:$("#essay").val(),
            realop:$("#realop").is(":checked")?1:0
        }, function(ret){}, "json");
    });

    app.populateBody();
});
