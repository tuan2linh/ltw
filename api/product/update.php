<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
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

$product->show();

$product->productName = isset($data->productName) ? $data->productName : $product->productName;
$product->price = isset($data->price) ? $data->price : $product->price;
$product->description = isset($data->description) ? $data->description : $product->description;
$product->image = isset($data->image) ? $data->image : $product->image;


if ($product->update()) {
    echo json_encode(
        array('message' => 'Product updated')
    );
} else {
    echo json_encode(
        array('message' => 'Product not updated')
    );
}