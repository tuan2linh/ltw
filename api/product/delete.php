<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/product.php';

$db = new db();
$connect = $db->connect();

$product = new Product($connect);

$product->memberId = isset($_GET['memberId']) ? $_GET['memberId'] : die();

$product->delete();

echo json_encode(
    array('message' => 'Product deleted')
);