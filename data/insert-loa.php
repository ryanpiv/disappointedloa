<?php

$username = "disappointedloa";
$password = "Nr2s?!FlWSPG";
$hostname = "mysql4.gear.host";
$db = "disappointedsong";
$con = mysqli_connect($hostname, $username, $password, $db);

$sql = "INSERT INTO polls (strawpollid, dateStart, dateEnd) VALUES(" . $id . ", Now(), DATE_ADD(Now(),INTERVAL 1 WEEK))";
$result = $con->query($sql);

if (!$result) {
	print_r("Error: " . $sql . "<br>" . $con->error);
} else {
	print_r($result);
}

?>