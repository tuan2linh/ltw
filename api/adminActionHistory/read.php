<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once '../../config/db.php';
include_once '../../model/adminActionHistory.php';
include_once '../../middleware/middleware.php';

$db = new db();
$connect = $db->connect();

$middleware = new Middleware($connect);
$middleware->checkAdmin();

$adminActionHistory = new AdminActionHistory($connect);
$result = $adminActionHistory->read();

if ($result->rowCount() > 0) {
    $adminActionHistory_arr = array();
    $adminActionHistory_arr['actions'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $action_item = array(
            'actionId' => $actionId,
            'adminId' => $adminId,
            'action' => $action
        );

        array_push($adminActionHistory_arr['actions'], $action_item);
    }

    echo json_encode($adminActionHistory_arr);
} else {
    echo json_encode(
        array('message' => 'No action found')
    );
}