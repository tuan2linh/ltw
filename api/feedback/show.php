<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/feedback.php';

$db = new db();
$connect = $db->connect();

$feedback = new Feedback($connect);

$feedback->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();
$feedback->productId = isset($_GET['productId']) ? $_GET['productId'] : die();

$feedback->show();

$feedback_arr = array(
    'memberId' => $feedback->memberId,
    'productId' => $feedback->productId,
    'comment' => $feedback->comment,
    'rating' => $feedback->rating
);

print_r(json_encode($feedback_arr));