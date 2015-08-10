<?php

require_once("../creds.php");

$query = "SELECT `name`, count(sid) AS submissions FROM `topics`,`submissions` WHERE tid = topicid GROUP BY tid ORDER BY `name`";
$result = mysqli_query($db, $query);
$response = mysqli_fetch_all($result, MYSQLI_NUM);

exit(json_encode(array("data"=>$response)));
