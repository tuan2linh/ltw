<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/included.php';

$db = new db();
$connect = $db->connect();

$included = new Included($connect);

$included->cartId = isset($_GET['cartId']) ? $_GET['cartId'] : die();
$included->productId = isset($_GET['productId']) ? $_GET['productId'] : die();

if ($included->delete()) {
    echo json_encode(
        array('message' => 'Include deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Include not deleted')
    );
}