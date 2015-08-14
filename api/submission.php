<?php

require_once("creds.php");

$response = array();

$topicid = "";

if($_SERVER['REQUEST_METHOD']=='POST'){
    $topicid = mysqli_real_escape_string($db, $_POST['topicid']);
    $result = mysqli_query($db, "INSERT INTO  submissions (`topicid`, `content`, `realop`, `userid`) VALUES ($topicid,'".
        mysqli_real_escape_string($db, $_POST['content'])."',".
        mysqli_real_escape_string($db, $_POST['realop']).",".
        mysqli_real_escape_string($db, $_POST['userid']).")");
}

$query = "SELECT tid, name, description, sid, content FROM topics LEFT JOIN (submissions) ON (tid = topicid)";
if(!is_null($_GET['topicname'])) {
    $query = "$query WHERE name = '".mysqli_real_escape_string($db, $_GET['topicname'])."'";
} elseif($topicid != "") {
    $query = "$query WHERE tid = $topicid";
}
$query = "$query ORDER BY RAND() LIMIT 1";
$results = mysqli_query($db, $query);
$response = mysqli_fetch_array($results, MYSQLI_ASSOC);

exit(json_encode($response));
