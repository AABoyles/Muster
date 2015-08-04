<?php

require_once("creds.php");

$response = array();

if($_SERVER['REQUEST_METHOD']=='POST'){
    $result = mysqli_query($db, "INSERT INTO  `submission` (`topicid`, `content`, `realop`, `createdby`) VALUES (".
        mysqli_real_escape_string($db, $_POST['topicid']).",'".
        mysqli_real_escape_string($db, $_POST['essay'])."',".
        mysqli_real_escape_string($db, $_POST['realop']).",".
        mysqli_real_escape_string($db, $_POST['uid']).")");
    if($result){
        $response["success"] = TRUE;
    } else {
        $response["success"] = FALSE;
    }
} else {
    $topic = "1";
    if(in_array("topicid",$_GET)){
        $topic = mysqli_real_escape_string($db, $_GET['topicid']);
    } else {
        $topic = "1";
    }
    $query = "SELECT sid, content, name FROM `submission`, `topic` WHERE tid = topicid AND tid = $topic ORDER BY RAND() LIMIT 100";
    $results = mysqli_query($db, $query);
    $response = mysqli_fetch_all($results, MYSQLI_ASSOC);
}

exit(json_encode($response));
