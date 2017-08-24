<?php
header('Content-Type: application/json');

include 'connect.php';

$raidTier = $_GET['raidTier'];
mysqli_real_escape_string($con, $raidTier);

//query to see if game already exists
$sql = "SELECT lh.class, count(lh.class) as classcount from loot_history as lh inner join raiders as r on lh.player = r.player where lh.instance like '%$raidTier%' group by lh.class order by lh.class asc";
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