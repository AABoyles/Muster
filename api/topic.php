<?php

require_once("creds.php");

$query = "INSERT INTO  `topic` (`name`, `description`) VALUES ('".
    mysqli_real_escape_string($db, $_POST['name'])."','".
    mysqli_real_escape_string($db, $_POST['description'])."')";
$result = mysqli_query($db, $query);

exit(json_encode(array("success"=>TRUE)));
