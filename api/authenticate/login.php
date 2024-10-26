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

if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(array('message' => 'Missing username or password'));
    exit();
}

$authenticate->username = $data->username;
$authenticate->password = $data->password;

$result = $authenticate->login();
$resultAdmin = $authenticate->loginAdmin();

if ($result) {
    // Fetch the result as an associative array
    $user = $result->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Generate a session token
        $token = bin2hex(random_bytes(32));
        $expiryTime = date('Y-m-d H:i:s', strtotime('30 minutes')); // Token expires in 30 minutes
        
        // Store the token in the database or session
        // This part depends on your specific implementation
        // $authenticate->storeToken($token);
        // Store the token in the database
        if ($authenticate->storeToken($user['memberId'],null, $token, $expiryTime)) {
            echo json_encode(array(
                'message' => 'Login successful',
                'role' => 'member',
                'token' => $token,
                'member' => array(
                    'id' => $user['memberId'],
                    'username' => $user['username'],
                    // Add any other user data you want to return
                )
            ));
            exit(); // Thêm exit() để kết thúc script sau khi đăng nhập thành công
        } else {
            echo json_encode(array('message' => 'Failed to store token'));
            exit();
        }
    }
}

if ($resultAdmin) {
    // Fetch the result as an associative array
    $admin = $resultAdmin->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        // Generate a session token
        $token = bin2hex(random_bytes(32));
        $expiryTime = date('Y-m-d H:i:s', strtotime('30 minutes')); // Token expires in 30 minutes
        
        // Store the token in the database or session
        // This part depends on your specific implementation
        // $authenticate->storeToken($token);
        // Store the token in the database
        if ($authenticate->storeToken(null, $admin['adminId'], $token, $expiryTime)) {
            echo json_encode(array(
                'message' => 'Login successful',
                'role' => 'admin',
                'token' => $token,
                'admin' => array(
                    'id' => $admin['adminId'],
                    'username' => $admin['username'],
                    // Add any other admin data you want to return
                )
            ));
            exit(); // Thêm exit() để kết thúc script sau khi đăng nhập thành công
        } else {
            echo json_encode(array('message' => 'Failed to store token'));
            exit();
        }
    }
}

// Nếu không có kết quả nào khớp, trả về thông báo lỗi
echo json_encode(array('message' => 'Invalid username or password'));
?>
