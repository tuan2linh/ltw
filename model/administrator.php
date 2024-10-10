<?php
class Administrator
{
    public $conn;

    public $adminId;
    public $username;
    public $password;
    public $fullName;
    public $birth;
    public $phoneNumber;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Administrator';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Administrator WHERE adminId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->adminId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->username = $row['username'];
        $this->password = $row['password'];
        $this->fullName = $row['fullName'];
        $this->birth = $row['birth'];
        $this->phoneNumber = $row['phoneNumber'];
    }

    public function create()
    {
        $query = 'INSERT INTO Administrator SET adminId = :adminId, username = :username, password = :password, fullName = :fullName, birth = :birth, phoneNumber = :phoneNumber';
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->fullName = htmlspecialchars(strip_tags($this->fullName));
        $this->birth = htmlspecialchars(strip_tags($this->birth));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':adminId', $this->adminId);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':fullName', $this->fullName);
        $stmt->bindParam(':birth', $this->birth);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE Administrator SET username = :username, password = :password, fullName = :fullName, birth = :birth, phoneNumber = :phoneNumber WHERE adminId = :adminId';
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->fullName = htmlspecialchars(strip_tags($this->fullName));
        $this->birth = htmlspecialchars(strip_tags($this->birth));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':adminId', $this->adminId);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':fullName', $this->fullName);
        $stmt->bindParam(':birth', $this->birth);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Administrator WHERE adminId = :adminId';
        $stmt = $this->conn->prepare($query);

        $this->adminId = htmlspecialchars(strip_tags($this->adminId));

        $stmt->bindParam(':adminId', $this->adminId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}