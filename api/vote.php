<?php

require("../creds.php");

$result = mysqli_query($db, "INSERT INTO  `vote` (`submissionid`, `isreal`) VALUES ('".$_POST['id']."',".$_POST['real'].")");


$result1 = mysqli_query($db, "SELECT count(1) as realVotes FROM `vote` WHERE submissionid = ".$_POST['id']." AND isreal = 1");
$votesreal = mysqli_fetch_assoc($result1)['realVotes'];

$result2 = mysqli_query($db, "SELECT count(1) as fakeVotes FROM `vote` WHERE submissionid = ".$_POST['id']." AND isreal = 0");
$votesfake = mysqli_fetch_assoc($result2)['fakeVotes'];

$result3 = mysqli_query($db, "SELECT realop FROM `submission` WHERE id = ".$_POST['id']);
$isreal = mysqli_fetch_assoc($result3)['realop'];

exit(json_encode(array(
    "votesReal"=>$votesreal,
    "votesFake"=>$votesfake,
    "isReal"=>$isreal
)));
