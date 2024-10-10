<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/product.php';

$db = new db();
$connect = $db->connect();

$product = new Product($connect);

$stmt = $product->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $product_arr = array();
    $product_arr['products'] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $product_item = array(
            'productId' => $productId,
            'productName' => $productName,
            'price' => $price,
            'description' => $description,
            'image' => $image
        );

        array_push($product_arr['products'], $product_item);
    }

    echo json_encode($product_arr);
} else {
    echo json_encode(
        array('message' => 'No products found')
    );
}
