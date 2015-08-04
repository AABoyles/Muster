<?php

require_once("creds.php");

$response = array();

if($_SERVER['REQUEST_METHOD']=='POST'){
    $topicname = mysqli_real_escape_string($db, $_POST['name']);
    $query = "INSERT INTO `topic` (`name`, `description`, `createdby`) VALUES ('$topicname','".
        mysqli_real_escape_string($db, $_POST['description'])."',".
        mysqli_real_escape_string($db, $_POST['uid']).")";
    $result = mysqli_query($db, $query);
    if($result) {
        $response["success"] = TRUE;
        $result = mysqli_query($db, "SELECT tid FROM `topic` WHERE `name` = '$topicname'");
        $row = $result->fetch_array(MYSQLI_NUM);
        $response['tid'] = $row[0];
    } else {
        $response["success"] = FALSE;
    }
} else {
    $query = "SELECT `name` FROM  `topic` ORDER BY `name`";
    $result = mysqli_query($db, $query);
    while($row = $result->fetch_array(MYSQLI_NUM)){
        $response[] = $row[0];
    }
}

exit(json_encode($response));
