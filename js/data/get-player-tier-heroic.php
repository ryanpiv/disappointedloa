<?php
header('Content-Type: application/json');

include 'connect.php';

$raidTier = $_GET['raidTier'];
mysqli_real_escape_string($con, $raidTier);

//query to see if game already exists
$sql = "SELECT distinct lh.player, count(lh.item) as num, lh.class
from disappointedloa.loot_history as lh
INNER JOIN disappointedloa.raiders as raiders ON lh.player = raiders.player and raiders.status = 1
where (lh.item like '%conqueror%' or lh.item like '%vanquisher%' or lh.item like '%protector%') AND lh.instance like '$raidTier%'
and lh.instance='Tomb of Sargeras-Heroic'
group by lh.player
order by lh.player desc";
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