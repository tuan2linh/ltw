<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');
include_once '../../config/db.php';
include_once '../../model/authenticate.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');

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
    $expiryTime = date('Y-m-d H:i:s', strtotime('+30 minutes')); // Token expires in 30 minutes

    // Get the newly registered user's ID
    $userId = $connect->lastInsertId();

    // Store the token in the database
    if ($authenticate->storeToken($userId,null, $token, $expiryTime)) {
        echo json_encode(array(
            'message' => 'User registered successfully',
            'token' => $token,
            'member' => array(
                'id' => $userId,
                'username' => $data->username,
                'fullName' => $data->fullName,
                'birth' => $data->birth,
                'phoneNumber' => $data->phoneNumber,
                // Add any other user data you want to return
            )
        ));
    } else {
        echo json_encode(array('message' => 'Failed to store token'));
    }
} else {
    echo json_encode(array('message' => 'User registration failed'));
}
?>