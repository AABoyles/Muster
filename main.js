$(function(){
    $(".voteReal, .voteFake").click(function(){
        var $this = $(this);
        $.post("api/vote.php", {id: this.id, real: $this.hasClass("voteReal")}, function(ret){
            console.log(ret);
            var newhtml = "Votes for Real: " + ret["votesReal"] + "<br />" + "Votes for Fake: " + ret["votesFake"] + "<br />" + "Was it Real? " + (ret["isReal"]=="1" ? "YUP." : "NOPE.");
            $this.parent().fadeOut(400, function(){
                $(this).html(newhtml).fadeIn();
            });
        }, "json");
    });
});