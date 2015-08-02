<?php

require_once("creds.php");

$query = "INSERT INTO  `user` (`email`, `password`) VALUES ('".mysqli_real_escape_string($db, $_POST['email'])."', '".mysqli_real_escape_string($db, $_POST['password'])."')";
$result = mysqli_query($db, $query);

$query = "SELECT uid FROM  `user` WHERE `email` = '".mysqli_real_escape_string($db, $_POST['email'])."'";
$result = mysqli_query($db, $query);
$uid = mysqli_fetch_assoc($result)['uid'];

exit(json_encode(array("success"=>TRUE, "uid"=>$uid)));
