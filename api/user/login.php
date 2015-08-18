<?php

require_once("../creds.php");

$response = array("success"=>FALSE);

$email = mysqli_real_escape_string($db, $_POST['email']);
$password = hash("sha512", mysqli_real_escape_string($db, $_POST['password']));
$result = mysqli_query($db, "SELECT uid FROM  `users` WHERE `email` = '$email'");

if(is_null(mysqli_fetch_array($result, MYSQLI_ASSOC))){
  $salt = mcrypt_create_iv(64);
  $query = "INSERT INTO  `users` (`email`, `password`, `salt`) VALUES ('$email', '$password', '$salt')";
  $result = mysqli_query($db, $query);
}

$query = "SELECT uid FROM  `users` WHERE `email` = '$email' AND password = '$password'";
$result = mysqli_query($db, $query);
$uid = mysqli_fetch_array($result, MYSQLI_ASSOC);

if(mysqli_num_rows($result)==1){
  $response['success'] = TRUE;
  $response['uid'] = $uid['uid'];
  $_SESSION['uid'] = $uid['uid'];
} else {
  $response['message'] = 'Incorrect Password!';
}

exit(json_encode($response));
