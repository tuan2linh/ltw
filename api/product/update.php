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

$product_id = $product->productId;
$product_name = $product->productName;
$product_price = $product->price;
$product_description = $product->description;
$product_image = $product->image;

if ($product->update()) {
    echo json_encode(
        array('message' => 'Product updated')
    );
} else {
    echo json_encode(
        array('message' => 'Product not updated')
    );
}