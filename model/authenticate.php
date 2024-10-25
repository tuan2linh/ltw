<?php
class Authenticate
{
    public $conn;

    public $username;
    public $password;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function login()
    {
        $query = 'SELECT * FROM member WHERE username = ? AND password = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->bindParam(2, $this->password);
        $stmt->execute();
        return $stmt;
    }
    public function loginAdmin()
    {
        $query = 'SELECT * FROM administrator WHERE username = ? AND password = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->bindParam(2, $this->password);
        $stmt->execute();
        return $stmt;
    }
    public function usernameExists()
    {
        $query = 'SELECT * FROM member WHERE username = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    public function register()
    {
        $query = 'INSERT INTO member (username, password, fullName, birth, phoneNumber) VALUES (:username, :password, :fullName, :birth, :phoneNumber)';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':fullName', $this->fullName);
        $stmt->bindParam(':birth', $this->birth);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);
        return $stmt->execute();
    }
    public function logout($token) {
        $query = "DELETE FROM Token WHERE token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        return $stmt->execute();
    }
    public function storeToken($memberId, $adminId, $token, $expiryTime) {
        $query = "INSERT INTO Token (memberId, adminId, token, expiryTime) VALUES (:memberId, :adminId, :token, :expiryTime)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':memberId', $memberId);
        $stmt->bindParam(':adminId', $adminId);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expiryTime', $expiryTime);
        return $stmt->execute();
    }
    public function verifyToken($token) {
        $query = "SELECT * FROM Token WHERE token = :token AND expiryTime > NOW()";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    public function isMember($token) {
        $query = "SELECT * FROM Token WHERE token = :token AND memberId IS NOT NULL";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    public function isAdmin($token) {
        $query = "SELECT * FROM Token WHERE token = :token AND adminId IS NOT NULL";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}