<?php
include_once '../../config/db.php';
include_once '../../model/authenticate.php';

class Middleware {
    private $authenticate;

    public function __construct($db) {
        $this->authenticate = new Authenticate($db);
    }

    public function verifyToken($token) {
        return $this->authenticate->verifyToken($token);
    }

    public function isAdmin($token) {
        return $this->authenticate->isAdmin($token);
    }

    public function isMember($token) {
        return $this->authenticate->isMember($token);
    }

    public function getTokenFromHeaders() {
        $headers = getallheaders();
        return isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    }

    public function checkAdmin() {
        $token = $this->getTokenFromHeaders();
        if (!$token) {
            echo json_encode(array('message' => 'Token not provided'));
            exit();
        }

        if (!$this->verifyToken($token)) {
            echo json_encode(array('message' => 'Invalid or expired token'));
            exit();
        }

        if (!$this->isAdmin($token)) {
            echo json_encode(array('message' => 'Not an admin'));
            exit();
        }
    }
    public function checkMember() {
        $token = $this->getTokenFromHeaders();
        if (!$token) {
            echo json_encode(array('message' => 'Token not provided'));
            exit();
        }

        if (!$this->verifyToken($token)) {
            echo json_encode(array('message' => 'Invalid or expired token'));
            exit();
        }

        if (!$this->isMember($token) && !$this->isAdmin($token)) {
            echo json_encode(array('message' => 'Not an admin or member'));
            exit();
        }
    }

}
?>