<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../model/orderDirect.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

// Check authentication
$middleware = new Middleware($connect);
$middleware->checkMember();
$memberId = $middleware->getId();

// Get orderId from URL
if (!isset($_GET['orderId'])) {
    echo json_encode(array('message' => 'Missing Order ID'));
    exit();
}

$orderId = $_GET['orderId'];

// Check if order exists and belongs to member
$order = new Order($connect);
$order->orderId = $orderId;
$existingOrder = $order->show();
// in ra exsitingOrder
if (!$existingOrder || $existingOrder['memberId'] != $memberId) {
    echo json_encode(array('message' => 'Order not found or unauthorized'));
    exit();
}

// Get input data
$data = json_decode(file_get_contents("php://input"));

// Update order details if provided, otherwise keep existing
$order->payStatus = $data->payStatus ?? $existingOrder['payStatus'];
$order->dayBooking = $data->dayBooking ?? $existingOrder['dayBooking'];
$order->Reciever = $data->Reciever ?? $existingOrder['Reciever'];
$order->shipStatus = $data->shipStatus ?? $existingOrder['shipStatus'];
$order->address = $data->address ?? $existingOrder['address'];
$order->phoneNumber = $data->phoneNumber ?? $existingOrder['phoneNumber'];
$order->cartId = $data->cartId ?? $existingOrder['cartId'];

// Update order basic info
if ($order->update()) {
    $orderDirect = new OrderDirect($connect);
    $orderDirect->orderId = $orderId;

    // Get current products
    $currentProducts = $orderDirect->read($orderId);
    $existingProducts = [];
    while ($product = $currentProducts->fetch(PDO::FETCH_ASSOC)) {
        $existingProducts[$product['productId']] = $product;
    }

    // Process new products
    if (!empty($data->products)) {
        foreach ($data->products as $newProduct) {
            $orderDirect->productId = $newProduct->productId;
            $orderDirect->quantity = $newProduct->quantity;
            
            if ($orderDirect->quantity > 0) {
                // Update or create product in order
                if (isset($existingProducts[$newProduct->productId])) {
                    $orderDirect->update();
                } else {
                    $orderDirect->create();
                }
            } else {
                // Remove product if quantity is 0
                $orderDirect->delete();
            }
        }
    }

    // Get final product list
    $finalProducts = $orderDirect->read($orderId);
    $productsList = [];
    while ($product = $finalProducts->fetch(PDO::FETCH_ASSOC)) {
        $productsList[] = array(
            'productId' => $product['productId'],
            'productName' => $product['productName'],
            'price' => $product['price'],
            'quantity' => $product['quantity'],
            'image' => $product['image']
        );
    }

    // Return response with updated order and products
    echo json_encode(array(
        'message' => 'Order updated successfully',
        'order' => $order,
        'products' => $productsList
    ));
} else {
    echo json_encode(array('message' => 'Failed to update order'));
}