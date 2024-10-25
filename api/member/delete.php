<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/member.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$member = new Member($connect);

$member->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();

$member->delete();

echo json_encode(
    array('message' => 'Member deleted')
);