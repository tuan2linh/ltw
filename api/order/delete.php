<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/db.php';
include_once '../../model/order.php';
include_once '../../middleware/middleware.php';

// Kết nối cơ sở dữ liệu
$db = new db();
$connect = $db->connect();

// Kiểm tra quyền truy cập
$middleware = new Middleware($connect);
$middleware->checkMember();

// Tạo đối tượng Order
$order = new Order($connect);

// Lấy orderId từ yêu cầu
$order->orderId = isset($_GET['orderId']) ? $_GET['orderId'] : die();

// Xóa đơn hàng
if ($order->delete()) {
    echo json_encode(
        array('message' => 'Order deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Order not deleted')
    );
}