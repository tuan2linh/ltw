<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, 
Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/cart.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();

$cart = new Cart($connect);

$data = json_decode(file_get_contents("php://input"));

$cart->cartId = $data->cartId;
$cart->createDay = $data->createDay;
$cart->memberId = $data->memberId;

if ($cart->create()) {
    echo json_encode(
        array('message' => 'Cart created')
    );
} else {
    echo json_encode(
        array('message' => 'Cart not created')
    );
}