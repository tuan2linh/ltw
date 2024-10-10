<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/cart.php';

$db = new db();
$connect = $db->connect();

$cart = new Cart($connect);
$result = $cart->read();

if ($result->rowCount() > 0) {
    $cart_arr = array();
    $cart_arr['carts'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $cart_item = array(
            'cartId' => $cartId,
            'createDay' => $createDay,
            'memberId' => $memberId
        );

        array_push($cart_arr['carts'], $cart_item);
    }

    echo json_encode($cart_arr);
} else {
    echo json_encode(
        array('message' => 'No cart found')
    );
}