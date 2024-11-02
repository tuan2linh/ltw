<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/administrator.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$administrator = new Administrator($connect);
$result = $administrator->read();

if ($result->rowCount() > 0) {
    $administrator_arr = array();
    $administrator_arr['administrators'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $administrator_item = array(
            'adminId' => $adminId,
            'username' => $username,
            'password' => $password,
            'fullName' => $fullName,
            'birth' => $birth,
            'phoneNumber' => $phoneNumber
        );

        array_push($administrator_arr['administrators'], $administrator_item);
    }

    echo json_encode($administrator_arr);
} else {
    echo json_encode(
        array('message' => 'No administrator found')
    );
}