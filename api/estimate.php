<?php

require_once("creds.php");

if($_SERVER['REQUEST_METHOD']=="POST"){
    $result = mysqli_query($db, "INSERT INTO  `vote` (`submissionid`, `isreal`) VALUES ('".
        mysqli_real_escape_string($db, $_POST['id'])."',".
        mysqli_real_escape_string($db, $_POST['real']).")");
}

$result1 = mysqli_query($db, "SELECT count(1) as realVotes FROM `vote` WHERE submissionid = ".mysqli_real_escape_string($db, $_REQUEST['id'])." AND isreal = 1");
$votesreal = mysqli_fetch_assoc($result1)['realVotes'];

$result2 = mysqli_query($db, "SELECT count(1) as fakeVotes FROM `vote` WHERE submissionid = ".mysqli_real_escape_string($db, $_REQUEST['id'])." AND isreal = 0");
$votesfake = mysqli_fetch_assoc($result2)['fakeVotes'];

$result3 = mysqli_query($db, "SELECT realop FROM `submission` WHERE sid = ".mysqli_real_escape_string($db, $_REQUEST['id']));
$isreal = mysqli_fetch_assoc($result3)['realop'];

exit(json_encode(array(
    "votesReal"=>$votesreal,
    "votesFake"=>$votesfake,
    "isReal"=>$isreal
)));
