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
    $query = "SELECT name, description, tid FROM `topic`";
    if(!is_null($_GET['topicid'])){
        $topicid = mysqli_real_escape_string($db, $_GET['topicid']);
        $query = "$query WHERE tid = $topicid";
    } elseif(!is_null($_GET['topicname'])) {
        $topicname = mysqli_real_escape_string($db, $_GET['topicname']);
        $query = "$query WHERE name = '$topicname'";
    }
    $results = mysqli_query($db, $query);
    $response['topic'] = mysqli_fetch_assoc($results);

    if(is_null($topicid)){
        $topicid = $response['topic']['tid'];
    }
    $query = "SELECT sid, content FROM `submission` WHERE topicid = $topicid ORDER BY RAND() LIMIT 10";
    $results = mysqli_query($db, $query);
    $response['submissions'] = mysqli_fetch_all($results, MYSQLI_ASSOC);
}

exit(json_encode($response));
