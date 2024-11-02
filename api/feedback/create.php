<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/feedback.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();

$feedback = new Feedback($connect);

$data = json_decode(file_get_contents("php://input"));

$feedback->memberId = $data->memberId;
$feedback->productId = $data->productId;
$feedback->comment = $data->comment;
$feedback->rating = $data->rating;

if ($feedback->create()) {
    echo json_encode(
        array('message' => 'Feedback created')
    );
} else {
    echo json_encode(
        array('message' => 'Feedback not created')
    );
}