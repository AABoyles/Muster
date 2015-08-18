<?php

require_once("../creds.php");

$response = array("success"=>FALSE);

$email = mysqli_real_escape_string($db, $_POST['email']);
$password = hash("sha512", mysqli_real_escape_string($db, $_POST['password']));

$query = "SELECT uid FROM  `users` WHERE `email` = '$email' AND password = '$password'";
$result = mysqli_query($db, $query);

if(mysqli_num_rows($result)==1){
    $response['success'] = TRUE;
    session_unset();
    session_destroy();
}

exit(json_encode($response));
