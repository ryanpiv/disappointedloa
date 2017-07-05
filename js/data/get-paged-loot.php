<?php
header('Content-Type: application/json');

$username = "disappointedloa";
$password = "Nr2s?!FlWSPG";
$hostname = "mysql4.gear.host";
$db = "disappointedloa";
$con = mysqli_connect($hostname, $username, $password, $db);

$pageNum = $_GET['pageNum'];
$pageSize = intval($_GET['pageSize']);
$sort = $_GET['sort'];
$sortCol = $_GET['sortCol'];

if ($pageNum != '') {
	$pageNum -= 1;
	$pageNum = $pageNum * 10;
} else {
	$pageNum = 0;
}

//query to see if game already exists
if ($sort == 'null') {
	$sql = "SELECT * FROM loot_history LIMIT " . $pageSize . " OFFSET " . $pageNum;
} else {
	$sql = "SELECT * FROM loot_history order by " . $sortCol . " " . $sort . " LIMIT " . $pageSize . " OFFSET " . $pageNum;
}

$result = $con->query($sql);

try {
	if (!$result) {
		print_r("Error: " . $sql . "<br>" . $con->error);
	} else {
		$json = mysqli_fetch_all($result, MYSQLI_ASSOC);
		echo json_encode($json);
	}
} catch (Exception $e) {
	die($e);
}

?>