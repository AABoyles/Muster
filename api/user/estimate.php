<?php

require_once("creds.php");

$sid = mysqli_real_escape_string($db, $_POST['sid']);

if($_SERVER['REQUEST_METHOD']=="POST"){
    $result = mysqli_query($db, "INSERT INTO  estimates (`submissionid`, `estimate`) VALUES ($sid,". mysqli_real_escape_string($db, $_POST['estimate']).")");
}

$result2 = mysqli_query($db, "SELECT estimate as estimateValue, count(1) as numberOfEstimates FROM estimates WHERE submissionid = $sid GROUP BY estimate;");
$estimates = mysqli_fetch_all($result2, MYSQLI_ASSOC);

$result3 = mysqli_query($db, "SELECT realop FROM submissions WHERE sid = $sid");
$isreal = mysqli_fetch_assoc($result3)['realop'];

exit(json_encode(array(
    "estimates"=>$estimates,
    "isReal"=>$isreal
)));
