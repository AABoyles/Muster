<?php

require_once("creds.php");

if($_SERVER['REQUEST_METHOD']=="POST"){
    $result = mysqli_query($db, "INSERT INTO  estimates (`submissionid`, `estimate`) VALUES (".
        mysqli_real_escape_string($db, $_POST['sid']).",".
        mysqli_real_escape_string($db, $_POST['estimate']).")");
}

$result2 = mysqli_query($db, "SELECT estimate as estimateValue, count(1) as numberOfEstimates FROM estimates WHERE submissionid = ".
    mysqli_real_escape_string($db, $_REQUEST['sid'])." GROUP BY estimate;");
$estimates = mysqli_fetch_all($result2, MYSQLI_ASSOC);

$result3 = mysqli_query($db, "SELECT realop FROM submissions WHERE sid = ".
    mysqli_real_escape_string($db, $_REQUEST['sid']));
$isreal = mysqli_fetch_assoc($result3)['realop'];

exit(json_encode(array(
    "estimates"=>$estimates,
    "isReal"=>$isreal
)));
