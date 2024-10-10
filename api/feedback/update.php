<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/feedback.php';

$db = new db();
$connect = $db->connect();

$feedback = new Feedback($connect);

$data = json_decode(file_get_contents("php://input"));

$feedback->memberId = $data->memberId;
$feedback->productId = $data->productId;
$feedback->comment = $data->comment;
$feedback->rating = $data->rating;

if ($feedback->update()) {
    echo json_encode(
        array('message' => 'Feedback updated')
    );
} else {
    echo json_encode(
        array('message' => 'Feedback not updated')
    );
}