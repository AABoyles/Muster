<?php

require_once("../creds.php");

$query = "SELECT CONCAT(LEFT(content, 40),'...') AS content, count(eid) AS nestimates FROM submissions, estimates WHERE submissionid = sid";
if(isset($_SESSION['uid'])) {
    $uid = $_SESSION['uid'];
    $query = "$query AND submissions.userid = '$uid'";
}
$query = "$query GROUP BY submissionid";
$results = mysqli_query($db, $query);
$response = mysqli_fetch_all($results, MYSQLI_NUM);

exit(json_encode(array("data"=>$response)));
