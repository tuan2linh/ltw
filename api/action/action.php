<?php
// getStats.php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/db.php';
include_once '../../model/action.php';
include_once '../../middleware/middleware.php';

try {
    // Database connection
    
    $db = new db();
    $connect = $db->connect();

    // Check admin authorization
    $middleware = new Middleware($connect);
    $middleware->checkAdmin();

    // Get date parameter, default to today if not provided
    $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

    // Validate date format
    if (!DateTime::createFromFormat('Y-m-d', $date)) {
        throw new Exception('Invalid date format. Use YYYY-MM-DD');
    }
    
    // Get action stats
    $action = new Action($connect);
    $stats = $action->getStats($date);
    
    if ($stats) {
        echo json_encode([
            'status' => true,
            'date' => $date,
            'actions' => $stats['actions'],
            'totals' => $stats['totals']
        ]);
    }    else {
        throw new Exception('No statistics found for the specified date');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => $e->getMessage()
    ]);
}