<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/feedback.php';

$db = new db();
$connect = $db->connect();

$feedback = new Feedback($connect);
$result = $feedback->read();

if ($result->rowCount() > 0) {
    $feedback_arr = array();
    $feedback_arr['feedbacks'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $feedback_item = array(
            'memberId' => $memberId,
            'productId' => $productId,
            'comment' => $comment,
            'rating' => $rating
        );

        array_push($feedback_arr['feedbacks'], $feedback_item);
    }

    echo json_encode($feedback_arr);
} else {
    echo json_encode(
        array('message' => 'No feedback found')
    );
}