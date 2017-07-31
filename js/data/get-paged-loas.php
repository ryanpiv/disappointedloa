<?php
header('Content-Type: application/json');

include 'connect.php';

$pageNum = $_GET['pageNum'];
$pageSize = intval($_GET['pageSize']);
$sort = $_GET['sort'];
$sortCol = $_GET['sortCol'];

if ($pageNum != '') {
	$pageNum -= 1;
	$pageNum = $pageNum * $pageSize;
} else {
	$pageNum = 0;
}

//query to see if game already exists
if ($sort == 'null') {
	$sql = "SELECT * FROM loas LIMIT " . $pageSize . " OFFSET " . $pageNum;
} else {
	$sql = "SELECT * FROM loas order by " . $sortCol . " " . $sort . " LIMIT " . $pageSize . " OFFSET " . $pageNum;
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