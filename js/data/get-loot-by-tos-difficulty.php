<?php
header('Content-Type: application/json');

$username = "disappointedloa";
$password = "Nr2s?!FlWSPG";
$hostname = "mysql4.gear.host";
$db = "disappointedloa";
$con = mysqli_connect($hostname, $username, $password, $db);

//query to see if game already exists
$sql = "SELECT instance, count(instance) as instancecount from loot_history group by instance order by instance asc";
$result = $con->query($sql);

try {
	if (!$result) {
		print_r("Error: " . $sql . "<br>" . $con->error);
	} else {
		$response = array();
		while ($row = mysqli_fetch_assoc($result)) {
			$response[] = $row;
		}

		// save the JSON encoded array
		$jsonData = json_encode($response);
		print_r($jsonData);
	}
} catch (Exception $e) {
	die($e);
}

?>