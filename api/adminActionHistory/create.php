<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/adminActionHistory.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$adminActionHistory = new AdminActionHistory($connect);

$data = json_decode(file_get_contents("php://input"));

$adminActionHistory->adminId = $data->adminId;
$adminActionHistory->action = $data->action;

if ($adminActionHistory->create()) {
    echo json_encode(
        array('message' => 'Action created')
    );
} else {
    echo json_encode(
        array('message' => 'Action not created')
    );
}