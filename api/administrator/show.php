<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/administrator.php';
include_once '../../middleware/middleware.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$administrator = new Administrator($connect);
$administrator->adminId = isset($_GET['adminId']) ? $_GET['adminId'] : die();

$administrator->show();

$administrator_arr = array(
    'adminId' => $administrator->adminId,
    'username' => $administrator->username,
    'password' => $administrator->password,
    'fullName' => $administrator->fullName,
    'birth' => $administrator->birth,
    'phoneNumber' => $administrator->phoneNumber
);

print_r(json_encode($administrator_arr));