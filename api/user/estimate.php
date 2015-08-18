<?php

require_once("../creds.php");

$userid = mysqli_real_escape_string($db, $_GET['userid']);

$result = mysqli_query($db, "SELECT realop, estimate, COUNT( 1 ) FROM estimates, submissions WHERE submissionid = sid AND userid = $userid GROUP BY realop, estimate;");
$estimates = mysqli_fetch_all($result, MYSQLI_ASSOC);

exit(json_encode($estimates));
