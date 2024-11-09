<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/db.php';
include_once '../../model/product.php';
include_once '../../middleware/middleware.php';
include_once '../../model/action.php';

try {
    $db = new db();
    $connect = $db->connect();

    $middleware = new Middleware($connect);
    $middleware->checkAdmin();

    $product = new Product($connect);

    // Debug incoming data
    $raw_data = file_get_contents("php://input");
    error_log("Received data: " . $raw_data);
    
    $data = json_decode($raw_data);

    // Validate required fields
    if (!isset($data->productName) || !isset($data->price)) {
        throw new Exception("Missing required fields");
    }

    $product->productId = $data->productId ?? null; // Make optional since it's auto-increment
    $product->productName = $data->productName;
    $product->price = $data->price;
    $product->description = $data->description ?? '';
    $product->image = $data->image ?? '';

    if ($product->create()) {
        $action = new Action($connect);
        $action->logCreateProduct();
        echo json_encode([
            'message' => 'Product created',
            'status' => true
        ]);
    } else {
        throw new Exception("Failed to create product");
    }

} catch (Exception $e) {
    error_log("Error creating product: " . $e->getMessage());
    echo json_encode([
        'message' => 'Product not created: ' . $e->getMessage(),
        'status' => false
    ]);
}
