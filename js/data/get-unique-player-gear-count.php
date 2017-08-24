<?php
header('Content-Type: application/json');
include 'connect.php';

$raidTier = $_GET['raidTier'];
mysqli_real_escape_string($con, $raidTier);

//query to see if game already exists
$sql = "SELECT lh.player, count(*) as num, lh.class
FROM loot_history as lh
inner join raiders as r on lh.player = r.player
where lh.instance like '$raidTier%'
AND lh.response <> 'OS'
AND lh.response <> 'Pass'
AND lh.response <> 'xmog'
AND lh.response <> 'Sidegrade'
AND response <> 'Disenchant'
AND response <> 'Pass'
AND response <> 'Banking'
group by lh.player order by num desc";

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