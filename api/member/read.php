<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/member.php';

$db = new db();
$connect = $db->connect();

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
            'fullname' => $fullName,
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