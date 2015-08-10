<?php

require_once("creds.php");

$response = array("success"=>FALSE);

if($_SERVER['REQUEST_METHOD']=='POST'){
    $topicname = mysqli_real_escape_string($db, $_POST['name']);
    $query = "INSERT INTO topics (name, description, createdby) VALUES ('$topicname','".
        mysqli_real_escape_string($db, $_POST['description'])."',".
        mysqli_real_escape_string($db, $_POST['uid']).")";
    $result = mysqli_query($db, $query);
    if($result) {
        $response["success"] = TRUE;
        $result = mysqli_query($db, "SELECT tid FROM topics WHERE name = '$topicname' LIMIT 1");
        $row = mysqli_fetch_array($result, MYSQLI_NUM);
        $response['tid'] = $row[0];
        $response["success"] = TRUE;
    }
} else {
    $query = "SELECT tid, name, description, sid, content FROM topics LEFT JOIN (submissions) ON (tid = topicid)";
    if(!is_null($_GET['topicname'])){
        $topicname = mysqli_real_escape_string($db, $_GET['topicname']);
        $query = "$query WHERE name = '$topicname'";
    }
    $query = "$query ORDER BY RAND() LIMIT 1";
    $result = mysqli_query($db, $query);
    $response = $result->fetch_array(MYSQLI_ASSOC);
}

exit(json_encode($response));
