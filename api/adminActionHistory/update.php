<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/adminActionHistory.php';

$db = new db();
$connect = $db->connect();

$adminActionHistory = new AdminActionHistory($connect);

$data = json_decode(file_get_contents("php://input"));

$adminActionHistory->actionId = $data->actionId;
$adminActionHistory->adminId = $data->adminId;
$adminActionHistory->action = $data->action;

if ($adminActionHistory->update()) {
    echo json_encode(
        array('message' => 'Action updated')
    );
} else {
    echo json_encode(
        array('message' => 'Action not updated')
    );
}