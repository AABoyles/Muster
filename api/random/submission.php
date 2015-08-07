<?php

require_once("../creds.php");

$topicname = mysqli_real_escape_string($db, $_GET['topicname']);
$query = "SELECT tid, name, description, sid, content FROM topics LEFT JOIN (submissions) ON (tid=topicid) WHERE name = '$topicname' ORDER BY RAND() LIMIT 1";
$results = mysqli_query($db, $query);
$response = mysqli_fetch_array($results, MYSQLI_ASSOC);

exit(json_encode($response));
