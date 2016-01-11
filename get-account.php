<?php
require 'database.php';

$userID = $_POST['userID'];

$stmt = $mysqli->prepare("SELECT username, email, name, address FROM users WHERE userID = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('i', $userID);
$stmt->execute();
$stmt->bind_result($username, $email, $name, $address);

$stmt->fetch();
$output = array("username"=>$username, "email"=>$email, "name"=>$name, "address"=>$address);

$stmt->close();

echo json_encode($output);

?>