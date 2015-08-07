<?php

require_once("../creds.php");

$query = "SELECT tid, name, description, sid, content FROM topics LEFT JOIN (submissions) ON (tid = topicid) ORDER BY RAND() LIMIT 1";
$result = mysqli_query($db, $query);
$response = mysqli_fetch_array($result, MYSQLI_ASSOC);

exit(json_encode($response));
