<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/administrator.php';

$db = new db();
$connect = $db->connect();

$administrator = new Administrator($connect);

$administrator->adminId = isset($_GET['adminId']) ? $_GET['adminId'] : die();

if ($administrator->delete()) {
    echo json_encode(
        array('message' => 'Administrator deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Administrator not deleted')
    );
}