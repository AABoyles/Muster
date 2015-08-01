<?php

require("../creds.php");

$result = mysqli_query($db, "INSERT INTO  `submission` (`email`, `content`, `realop`) VALUES ('".$_POST['email']."','".$_POST['essay']."',".$_POST['realop'].")");
