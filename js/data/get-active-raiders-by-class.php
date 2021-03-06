<?php
header('Content-Type: application/json');

include 'connect.php';

//query to see if game already exists
$sql = "SELECT distinct class, count(class) as num FROM disappointedloa.raiders where status=1 group by class";
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