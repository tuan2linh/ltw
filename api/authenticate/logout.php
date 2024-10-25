<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/authenticate.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');

$db = new db();
$connect = $db->connect();

$authenticate = new Authenticate($connect);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->token)) {
    echo json_encode(array('message' => 'Missing token'));
    exit();
}

$token = $data->token;

if ($authenticate->logout($token)) {
    echo json_encode(array('message' => 'Logout successful'));
} else {
    echo json_encode(array('message' => 'Logout failed'));
}
?>