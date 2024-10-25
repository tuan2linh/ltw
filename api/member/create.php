<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/member.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$member = new Member($connect);

$data = json_decode(file_get_contents("php://input"));

$member->memberId = $data->memberId;
$member->username = $data->username;
$member->password = $data->password;
$member->fullName = $data->fullName;
$member->birth = $data->birth;
$member->phoneNumber = $data->phoneNumber;

if ($member->create()) {
    echo json_encode(
        array('message' => 'Member created')
    );
} else {
    echo json_encode(
        array('message' => 'Member not created')
    );
}