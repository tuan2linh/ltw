<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/included.php';

$db = new db();
$connect = $db->connect();

$included = new Included($connect);

$data = json_decode(file_get_contents("php://input"));

$included->cartId = $data->cartId;
$included->productId = $data->productId;

if ($included->update()) {
    echo json_encode(
        array('message' => 'Included updated')
    );
} else {
    echo json_encode(
        array('message' => 'Included not updated')
    );
}