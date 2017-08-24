<?php
header('Content-Type: application/json');
include 'connect.php';

$raidTier = $_GET['raidTier'];
mysqli_real_escape_string($con, $raidTier);

$con = mysqli_connect($hostname, $username, $password, $db);

//query to see if game already exists
$sql = "SELECT count(*) as num, item from disappointedloa.loot_history as lh
where (lh.item like '%conqueror%' or lh.item like '%vanquisher%' or lh.item like '%protector%')
and lh.instance like '$raidTier%'
group by item like '%conqueror%', item like '%vanquisher%', item like '%protector%'
order by item";
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