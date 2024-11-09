<?php
// updateShip.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../middleware/middleware.php';
include_once '../../model/action.php';

try {
    // Database connection
    $db = new db();
    $connect = $db->connect();

    // Check admin authorization
    $middleware = new Middleware($connect);
    if(!$middleware->checkAdmin()){
        exit();
    }

    // Get orderId from URL
    if (!isset($_GET['orderId'])) {
        throw new Exception('Missing Order ID');
    }

    $orderId = $_GET['orderId'];

    // type1 is update ship status
    // type2 is update pay status
    if (isset($_GET['type1'])) {
        $type1 = $_GET['type1'];
        if ($type1 != 'ship' && $type1 != 'unship') {
            throw new Exception('Invalid type');
        }
    }

    if (isset($_GET['type2'])) {
        $type2 = $_GET['type2'];
        if ($type2 != 'pay' && $type2 != 'unpay') {
            throw new Exception('Invalid type');
        }
    }

    // Initialize order
    $order = new Order($connect);
    $order->orderId = $orderId;

    // Get existing order
    $existingOrder = $order->show();
    if (!$existingOrder) {
        throw new Exception('Order not found');
    }

    // Update shipping status
    $order->payStatus = $existingOrder['payStatus'];
    $order->dayBooking = $existingOrder['dayBooking'];
    $order->Reciever = $existingOrder['Reciever'];
    $order->address = $existingOrder['address'];
    $order->phoneNumber = $existingOrder['phoneNumber'];
    $order->cartId = $existingOrder['cartId'];
    $order->memberId = $existingOrder['memberId'];

    if(isset($type1)){
        if ($type1 == 'ship') {
            $order->shipStatus = 'Shipped';
        } 
        else if ($type1 == 'unship') {
            $order->shipStatus = 'Processing';
        }
        else{
            $order->shipStatus= $existingOrder['shipStatus'];
        }
    }
    if (isset($type2)) {
        if ($type2 == 'pay') {
            $order->payStatus = 'Paid';
        } 
        else if ($type2 == 'unpay') {
            $order->payStatus = 'Pending';
        }
        else{
            $order->payStatus = $existingOrder['payStatus'];
        }
    }

    if ($order->update()) {
        // Log order success action
        $action = new Action($connect);
        $action->logOrderSuccess();

        echo json_encode([
            'message' => 'Shipping status updated successfully',
            'status' => true,
            'order' => [
                'orderId' => $orderId,
                'shipStatus' => $order->shipStatus,
                'payStatus' => $order->payStatus
            ]
        ]);
    } else {
        throw new Exception('Failed to update shipping status');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'message' => $e->getMessage(),
        'status' => false
    ]);
}