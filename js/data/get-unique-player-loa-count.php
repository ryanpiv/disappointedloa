<?php
header('Content-Type: application/json');

$username = "disappointedloa";
$password = "Nr2s?!FlWSPG";
$hostname = "mysql4.gear.host";
$db = "disappointedloa";
$con = mysqli_connect($hostname, $username, $password, $db);

//query to see if game already exists
$sql = "SELECT discordusername, count(*) as num FROM disappointedloa.loas where status=1 AND date < NOW() group by discordusername order by num desc";
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