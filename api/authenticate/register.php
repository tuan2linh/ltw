<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/authenticate.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');
include_once '../../model/cart.php';

$db = new db();
$connect = $db->connect();

$authenticate = new Authenticate($connect);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password) || !isset($data->fullName) || !isset($data->birth) || !isset($data->phoneNumber)) {
    echo json_encode(array('message' => 'Missing required fields'));
    exit();
}

$authenticate->username = $data->username;
$authenticate->password = $data->password; // Hash the password
$authenticate->fullName = $data->fullName;
$authenticate->birth = $data->birth;
$authenticate->phoneNumber = $data->phoneNumber;

// Check if the username already exists
if ($authenticate->usernameExists()) {
    echo json_encode(array('message' => 'Username already exists'));
    exit();
}

// Register the new user
if ($authenticate->register()) {
    // Generate a session token
    $token = bin2hex(random_bytes(32));
    $expiryTime = date('Y-m-d H:i:s', strtotime('+3 years')); // Token expires in 30 minutes

    // Get the newly registered user's ID
    $userId = $connect->lastInsertId();

    // Store the token in the database
    if ($authenticate->storeToken($userId,null, $token, $expiryTime)) {
        $cart = new Cart($connect);
        $cart->createDay = date('Y-m-d');
        $cart->memberId = $userId;
    
        $cartCreated = $cart->create();
        
        echo json_encode(array(
            'message' => 'User registered successfully' . ($cartCreated ? ' with cart' : ''),
            'token' => $token,
            'member' => array(
                'id' => $userId,
                'username' => $data->username,
                'fullName' => $data->fullName,
                'birth' => $data->birth,
                'phoneNumber' => $data->phoneNumber
            ),
            'cart' => $cartCreated ? array(
                'memberId' => $userId,
                'createDay' => date('Y-m-d')
            ) : null
        ));
    } else {
        echo json_encode(array('message' => 'Failed to store token'));
    }
} else {
    echo json_encode(array('message' => 'User registration failed'));
}
?>