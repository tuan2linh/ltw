<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../middleware/middleware.php';
include_once '../../model/member.php';
include_once '../../model/orderDirect.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();

// Get member ID and data
$memberId = $middleware->getId();
$member = new Member($connect);
$member->memberId = $memberId;  
$member->show();

$order = new Order($connect);

$data = json_decode(file_get_contents("php://input"));
if (
    empty($data->payStatus) ||
    empty($data->address) ||
    empty($data->phoneNumber)
) {
    echo json_encode(
        array('message' => 'Thiếu thông tin đầu vào')
    );
    return;
}

$order->payStatus = $data->payStatus;
$order->dayBooking = date('Y-m-d H:i:s');
$order->Reciever = !empty($data->Reciever) ? $data->Reciever : $member->fullName;
$order->shipStatus = 'Processing';
$order->address = $data->address;
$order->phoneNumber = $data->phoneNumber;
$order->memberId = $memberId;
if (!empty($data->cartId)) {
    $order->cartId = $data->cartId;
} else {
    $order->cartId = null;
}

if($order->cartId == null && empty($data->products)){
    echo json_encode(
        array('message' => 'Thiếu thông tin giỏ hàng')
    );
    return;
}

$orderId = $order->create();

if ($orderId !== null) {
    $response = array(
        'message' => 'Tạo đơn hàng thành công',
        'order' => array(
            'orderId' => $orderId,
            'payStatus' => $order->payStatus,
            'dayBooking' => $order->dayBooking,
            'Reciever' => $order->Reciever,
            'shipStatus' => $order->shipStatus,
            'address' => $order->address,
            'phoneNumber' => $order->phoneNumber,
            'memberId' => $order->memberId,
            'cartId' => $order->cartId
        )
    );

    // Check if products array exists in input
    if (!empty($data->products) && is_array($data->products)) {
        $orderDirect = new OrderDirect($connect);
        $orderDirect->orderId = $orderId;
        
        $productsCreated = true;
        $createdProducts = array();

        foreach ($data->products as $product) {
            if (!empty($product->productId) && !empty($product->quantity)) {
                $orderDirect->productId = $product->productId;
                $orderDirect->quantity = $product->quantity;
                
                if (!$orderDirect->create()) {
                    $productsCreated = false;
                    break;
                }
                
                $createdProducts[] = array(
                    'productId' => $product->productId,
                    'quantity' => $product->quantity
                );
            }
        }

        if ($productsCreated) {
            $response['products'] = $createdProducts;
        } else {
            $response['message'] .= ' but failed to add some products';
        }
    }

    echo json_encode($response);
} else {
    echo json_encode(array('message' => 'Order not created'));
}