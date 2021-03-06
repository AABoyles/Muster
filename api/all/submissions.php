<?php

require_once("../creds.php");

$query = "SELECT tid, name, description, sid, content FROM topics LEFT JOIN (submissions) ON (tid=topicid)";
if(!is_null($_GET['topicname'])) {
    $topicname = mysqli_real_escape_string($db, $_GET['topicname']);
    $query = "$query WHERE name = '$topicname'";
}

$results = mysqli_query($db, $query);
$response = mysqli_fetch_array($results, MYSQLI_ASSOC);

exit(json_encode($response));
