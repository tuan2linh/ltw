<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/product.php';

$db = new db();
$connect = $db->connect();

$product = new Product($connect);

$product->productId = isset($_GET['productId']) ? $_GET['productId'] : die();

$product->show();

$product_arr = array(
    'productId' => $product->productId,
    'productName' => $product->productName,
    'price' => $product->price,
    'description' => $product->description,
    'image' => $product->image
);

print_r(json_encode($product_arr));
