<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Credentials: true");
include_once '../../config/db.php';
include_once '../../model/member.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$member = new Member($connect);
$result = $member->read();

if ($result->rowCount() > 0) {
    $member_arr = array();
    $member_arr['members'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $member_item = array(
            'memberId' => $memberId,
            'username' => $username,
            'password' => $password,
            'fullName' => $fullName,
            'birth' => $birth,
            'phoneNumber' => $phoneNumber
        );

        array_push($member_arr['members'], $member_item);
    }

    echo json_encode($member_arr);
} else {
    echo json_encode(
        array('message' => 'No member found')
    );
}