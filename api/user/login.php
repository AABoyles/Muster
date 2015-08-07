<?php

require_once("../creds.php");

$response = array("success"=>FALSE);

$email = mysqli_real_escape_string($db, $_POST['email']);
$password = hash("sha512", mysqli_real_escape_string($db, $_POST['password']));

$query = "SELECT uid FROM  `users` WHERE `email` = '$email'";
$result = mysqli_query($db, $query);
if(is_null(mysqli_fetch_array($result, MYSQLI_ASSOC))){
  $query = "INSERT INTO  `users` (`email`, `password`) VALUES ('$email', '$password')";
  $result = mysqli_query($db, $query);
}

$query = "SELECT uid FROM  `users` WHERE `email` = '$email' AND password = '$password'";
$result = mysqli_query($db, $query);
$uid = mysqli_fetch_array($result, MYSQLI_ASSOC);

if(mysqli_num_rows($result)>0){
    $response['success'] = TRUE;
    $response['uid'] = $uid['uid'];
    session_start();
}

exit(json_encode($response));
