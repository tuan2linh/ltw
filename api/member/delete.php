<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/member.php';

$db = new db();
$connect = $db->connect();

$member = new Member($connect);

$member->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();

$member->delete();

echo json_encode(
    array('message' => 'Member deleted')
);