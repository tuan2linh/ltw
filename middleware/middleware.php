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
            echo json_encode(array('message1' => 'Token not provided'));
            // return false;
            exit();
        }

        if (!$this->verifyToken($token)) {
            echo json_encode(array('message1' => 'Invalid or expired token'));
            // return false;
            exit();
        }

        if (!$this->isAdmin($token)) {
            return false;
            echo json_encode(array('message1' => 'Not an admin'));
            return false;
            exit();
        }
        return true;
    }
    public function checkMember() {
        $token = $this->getTokenFromHeaders();
        if (!$token) {
            echo json_encode(array('message2' => 'Token not provided'));
            return false;
            exit();
        }

        if (!$this->verifyToken($token)) {
            echo json_encode(array('message2' => 'Invalid or expired token'));
            return false;
            exit();
        }

        if (!$this->isMember($token)) {
            return false;
            echo json_encode(array('message2' => 'Not an member'));
            return false;
            exit();
        }
        return true;
    }

    public function getId(){
        $token = $this->getTokenFromHeaders();
        return $this->authenticate->getId($token);
    }

}
?>