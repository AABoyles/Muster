<?php

require_once("../creds.php");

$response = array();

$query = "SELECT `name` as topicname, `tid` as topicid FROM `topic` ORDER BY RAND() LIMIT 1";
$result = mysqli_query($db, $query);
$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

exit(json_encode($row));
