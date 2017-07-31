<?php
header('Content-Type: application/json');

include 'connect.php';
//query to see if game already exists
$sql = "SELECT count(*) as total FROM loas";
$result = $con->query($sql);

try {
	if (!$result) {
		print_r("Error: " . $sql . "<br>" . $con->error);
	} else {
		$data = mysqli_fetch_assoc($result);
		echo ($data['total']);
	}
} catch (Exception $e) {
	die($e);
}

?>