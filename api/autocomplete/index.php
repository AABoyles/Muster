<?php

require_once("../creds.php");

$query = "SELECT `name` FROM  `topics`";
if(!is_null($_GET['topicname'])){
    $topicname = mysqli_real_escape_string($db, $_GET['topicname']);
    $query = "$query WHERE name LIKE '%$topicname%'";
}
$query = "$query ORDER BY `name`";
$result = mysqli_query($db, $query);
while($row = $result->fetch_array(MYSQLI_NUM)){
    $response[] = $row[0];
}

exit(json_encode($response));
