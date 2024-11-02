<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/cart.php';
include_once '../../middleware/middleware.php';
include_once '../../model/member.php';
include_once '../../model/cart.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkMember();
$memberId = $middleware->getId();

$cart = new Cart($connect);

// Check if member already has a cart
if ($cart->checkExistingCart($memberId)) {
    echo json_encode(
        array('message' => 'Member already has a cart')
    );
    return;
}

$cart->createDay = date('Y-m-d'); 
$cart->memberId = $memberId;

if ($member->create()) {
    // Create cart for new member
    $cart = new Cart($connect);
    $cart->createDay = date('Y-m-d');
    $cart->memberId = $connect->lastInsertId();
    
    $cartCreated = $cart->create();
    
    echo json_encode(array(
        'message' => 'Member created' . ($cartCreated ? ' with cart' : ''),
        'cartCreated' => $cartCreated
    ));
} else {
    echo json_encode(array('message' => 'Member not created'));
}