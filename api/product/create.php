<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/product.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$product = new Product($connect);

$data = json_decode(file_get_contents("php://input"));

$product->productId = $data->productId;
$product->productName = $data->productName;
$product->price = $data->price;
$product->description = $data->description;
$product->image = $data->image;

if ($product->create()) {
    echo json_encode(
        array('message' => 'Product created')
    );
} else {
    echo json_encode(
        array('message' => 'Product not created')
    );
}

