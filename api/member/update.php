<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/member.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
if($middleware->checkMember()){
    $member = new Member($connect);
    $member->memberId = $middleware->getId();   
    $member->show();
    // Get input data
    $data = json_decode(file_get_contents("php://input"));

    // Update only provided fields, keep existing values for others
    $member->username = isset($data->username) ? $data->username : $member->username;
    $member->password = isset($data->password) ? $data->password : $member->password;
    $member->fullName = isset($data->fullName) ? $data->fullName : $member->fullName;
    $member->birth = isset($data->birth) ? $data->birth : $member->birth;
    $member->phoneNumber = isset($data->phoneNumber) ? $data->phoneNumber : $member->phoneNumber;

    if ($member->update()) {
        echo json_encode(array(
            'message' => 'Member updated successfully',
            'member' => array(
            'memberId' => $member->memberId,
            'username' => $member->username,
            'fullName' => $member->fullName,
            'birth' => $member->birth,
            'phoneNumber' => $member->phoneNumber
        )
    ));
} else {
    echo json_encode(array('message' => 'Member not updated'));
}
}
else {
    
    $middleware->checkAdmin();
    $member = new Member($connect);
    if (!isset($_GET['memberId'])) {
        http_response_code(400); // Bad Request
        echo json_encode(array(
            'message' => 'Đang là admin, cần nhập memberId để update',
            'success' => false
        ));
        exit();
    }
    
    $member->memberId = $_GET['memberId'];
    
    if (!is_numeric($member->memberId)) {
        http_response_code(400);
        echo json_encode(array(
            'message' => 'Invalid memberId format',
            'success' => false
        ));
        exit();
    }

    $member->show();

    $data = json_decode(file_get_contents("php://input"));

    $member->username = isset($data->username) ? $data->username : $member->username;
    $member->password = isset($data->password) ? $data->password : $member->password;
    $member->fullName = isset($data->fullName) ? $data->fullName : $member->fullName;
    $member->birth = isset($data->birth) ? $data->birth : $member->birth;
    $member->phoneNumber = isset($data->phoneNumber) ? $data->phoneNumber : $member->phoneNumber;

    if ($member->update()) {
        echo json_encode(array(
            'message' => 'Member updated successfully',
            'member' => array(
            'memberId' => $member->memberId,
            'username' => $member->username,
            'fullName' => $member->fullName,
            'birth' => $member->birth,
            'phoneNumber' => $member->phoneNumber
        )
    ));
} else {
    echo json_encode(array('message' => 'Member not updated'));
}
}
?>
