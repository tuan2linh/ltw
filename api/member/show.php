<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/member.php';

$db = new db();
$connect = $db->connect();

$member = new Member($connect);

$member->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();

$member->show();

$member_arr = array(
    'memberId' => $member->memberId,
    'username' => $member->username,
    'password' => $member->password,
    'fullname' => $member->fullname,
    'birth' => $member->birth,
    'phoneNumber' => $member->phoneNumber
);

print_r(json_encode($member_arr));
