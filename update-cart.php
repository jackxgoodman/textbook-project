<?php
require 'database.php';

$course = $_POST['courseID'];

$stmt = $mysqli->prepare("SELECT name, author, price, courses.code FROM books JOIN courses on (books.course=courses.courseID) WHERE bookID = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('i', $course);
$stmt->execute();
$stmt->bind_result($name, $author, $price, $courseName);

$stmt->fetch();
$output = array("name"=>$name, "author"=>$author, "price"=>$price, "courseName"=>$courseName);

$stmt->close();

echo json_encode($output);

?>