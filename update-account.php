<?php
require 'database.php';

$userID = $_POST['userID'];
$new_username = $_POST['new_username'];
$new_name = $_POST['new_name'];
$new_email = $_POST['new_email'];
$new_password = $_POST['new_password'];
$new_address = $_POST['new_address'];

if ($new_password == "") {
    $stmt = $mysqli->prepare("UPDATE users SET username=?, email=?, name=?, address=? WHERE userID = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt->bind_param('ssssi', $new_username, $new_email, $new_name, $new_address, $userID);
    $success = $stmt->execute();
    $output = array("success"=>$success);
    $stmt->close();
}
else {
     $stmt = $mysqli->prepare("UPDATE users SET username=?, password=?, email=?, name=?, address=? WHERE userID = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt->bind_param('sssssi', $new_username, crypt($new_password), $new_email, $new_name, $new_address, $userID);
    $success = $stmt->execute();
    $output = array("success"=>$success);
    $stmt->close();
}
echo json_encode($output);

?>