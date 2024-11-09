<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../model/orderDirect.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

// Check authentication
$middleware = new Middleware($connect);
if(!$middleware->checkMember()&&!$middleware->checkAdmin()){
    exit();
}

if($middleware->checkMember())
{
    $memberId = $middleware->getId();
}
else{
    if(!isset($_GET['memberId'])){
        echo json_encode(array('message' => 'Missing Member ID'));
        exit();
    }
    $memberId = $_GET['memberId'];
}

// Get and validate orderId
if (!isset($_GET['orderId'])) {
    echo json_encode(array('message' => 'Missing Order ID'));
    exit();
}

$orderId = $_GET['orderId'];

// Check if order exists and belongs to member
$order = new Order($connect);
$order->orderId = $orderId;

$query = 'SELECT * FROM `Order` WHERE orderId = :orderId AND memberId = :memberId';
$stmt = $order->conn->prepare($query);
$stmt->bindParam(':orderId', $orderId);
$stmt->bindParam(':memberId', $memberId);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $orderData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get order products
    $orderDirect = new OrderDirect($connect);
    $products_result = $orderDirect->read($orderId);
    $products = array();
    
    while ($product = $products_result->fetch(PDO::FETCH_ASSOC)) {
        $products[] = array(
            'productId' => $product['productId'],
            'productName' => $product['productName'],
            'price' => $product['price'],
            'quantity' => $product['quantity'],
            'image' => $product['image']
        );
    }
    
    // Combine and return response
    $response = array_merge($orderData, array('products' => $products));
    echo json_encode($response);
} else {
    echo json_encode(array('message' => 'Order not found or unauthorized'));
}