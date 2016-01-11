<?php
require 'database.php';

$query = $_POST['query'];
$output = array();

if ($query == "") {
	$stmt = $mysqli->prepare("SELECT courseID, code, title, professor FROM courses");

} else {
	$stmt = $mysqli->prepare("SELECT courseID, code, title, professor FROM courses WHERE code LIKE '%{$query}%' OR title LIKE '%{$query}%' OR professor LIKE '%{$query}%'");
}

if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->execute();
$stmt->bind_result($courseID, $code, $title, $professor);


while ($stmt->fetch()) {
    $output[] = array("courseID"=>htmlentities($courseID), "code"=>htmlentities($code), "title"=>htmlentities($title), "professor"=>htmlentities($professor));
}
$stmt->close();

echo json_encode($output);

?>