<?php

require_once("creds.php");

$response = array();

if($_SERVER['REQUEST_METHOD']=='POST'){
    $result = mysqli_query($db, "INSERT INTO  `submission` (`topicid`, `content`, `realop`, `createdby`) VALUES ('".
        mysqli_real_escape_string($db, $_POST['topicid']).",'".
        mysqli_real_escape_string($db, $_POST['essay'])."',".
        mysqli_real_escape_string($db, $_POST['realop']).",",
        intval(mysqli_real_escape_string($db, $_POST['uid'])).")");
    $response["success"] = TRUE;
} else {
    $query = "SELECT sid, content, name FROM `submission`, `topic` WHERE tid = topicid AND categoryid = ".
        mysqli_real_escape_string($db, $_GET['cid'])." ORDER BY name, RAND() LIMIT 100";
    $results = mysqli_query($db, $query);
    $response = mysqli_fetch_all($results, MYSQLI_ASSOC);
}

exit(json_encode($response));
