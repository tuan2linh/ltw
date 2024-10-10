<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/included.php';

$db = new db();
$connect = $db->connect();

$included = new Included($connect);
$result = $included->read();

if ($result->rowCount() > 0) {
    $include_arr = array();
    $include_arr['includeds'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $include_item = array(
            'cartId' => $cartId,
            'productId' => $productId
        );

        array_push($include_arr['includeds'], $include_item);
    }

    echo json_encode($include_arr);
} else {
    echo json_encode(
        array('message' => 'No include found')
    );
}