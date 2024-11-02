<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/cart.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();

$memberId = $middleware->getId();

$cart = new Cart($connect);

$cart->memberId = $memberId;

if ($cart->delete()) {
    echo json_encode(
        array('message' => 'Cart deleted')
    );
} else {
    echo json_encode(
        array('message' => 'Cart not deleted')
    );
}