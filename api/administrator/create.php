<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/administrator.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$administrator = new Administrator($connect);

$data = json_decode(file_get_contents("php://input"));

$administrator->adminId = $data->adminId;
$administrator->username = $data->username;
$administrator->password = $data->password;
$administrator->fullName = $data->fullName;
$administrator->birth = $data->birth;
$administrator->phoneNumber = $data->phoneNumber;

if ($administrator->create()) {
    echo json_encode(
        array('message' => 'Administrator created')
    );
} else {
    echo json_encode(
        array('message' => 'Administrator not created')
    );
}