<?php
require 'database.php';

$course = $_POST['currentCourse'];

$stmt = $mysqli->prepare("SELECT bookID, name, author, price, notes FROM books WHERE course = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('i', $course);
$stmt->execute();
$stmt->bind_result($bookID, $name, $author, $price, $notes);

$output = array();
while ($stmt->fetch()) {
    $output[] = array("bookID"=>htmlentities($bookID), "name"=>htmlentities($name), "author"=>htmlentities($author), "price"=>htmlentities($price), "notes"=>htmlentities($notes));
}
$stmt->close();

echo json_encode($output);

?>