<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../middleware/middleware.php';
include_once '../../model/orderDirect.php';

// Kết nối cơ sở dữ liệu
$db = new db();
$connect = $db->connect();

// Kiểm tra quyền truy cập
$middleware = new Middleware($connect);
$middleware->checkMember();
$memberId = $middleware->getId();

// Tạo đối tượng Order
$order = new Order($connect);
$orderDirect = new OrderDirect($connect);

// Lấy danh sách đơn hàng
$result = $order->read($middleware->getId());
$num = $result->rowCount();

// Kiểm tra nếu có đơn hàng
if ($num > 0) {
    $orders_arr = array();
    $orders_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $order_item = array(
            'orderId' => $orderId,
            'payStatus' => $payStatus,
            'dayBooking' => $dayBooking,
            'Reciever' => $Reciever,
            'shipStatus' => $shipStatus,
            'address' => $address,
            'phoneNumber' => $phoneNumber,
            'cartId' => $cartId
        );

        // Get products for this order
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
        
        $order_item['products'] = $products;
        array_push($orders_arr['data'], $order_item);
    }

    echo json_encode($orders_arr);
} else {
    // Không có đơn hàng nào
    echo json_encode(
        array('message' => 'No orders found')
    );
}