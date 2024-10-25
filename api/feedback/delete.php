<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/feedback.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();

$feedback = new Feedback($connect);

$feedback->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();
$feedback->productId = isset($_GET['productId']) ? $_GET['productId'] : die();

if ($feedback->delete()) {
    echo json_encode(
        array('message' => 'Feedback deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Feedback not deleted')
    );
}