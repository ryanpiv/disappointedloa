<?php
header('Content-Type: application/json');

include 'connect.php';

//query to see if game already exists
$sql = "SELECT lh.instance, count(lh.instance) as instancecount from loot_history as lh inner join raiders as r on lh.player = r.player group by lh.instance order by lh.instance asc";
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