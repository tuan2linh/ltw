<?php
class Member
{
    public $conn;

    public $memberId;
    public $username;
    public $password;
    public $fullname;
    public $birth;
    public $phoneNumber;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM member';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM member WHERE memberId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->username = $row['username'];
        $this->password = $row['password'];
        $this->fullname = $row['fullName'];
        $this->birth = $row['birth'];
        $this->phoneNumber = $row['phoneNumber'];

    }

    public function create()
    {
        $query = 'INSERT INTO member SET memberId = :memberId, username = :username, password = :password, fullName = :fullName, birth = :birth, phoneNumber = :phoneNumber';
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->fullname = htmlspecialchars(strip_tags($this->fullname));
        $this->birth = htmlspecialchars(strip_tags($this->birth));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':fullName', $this->fullname);
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
        $query = 'UPDATE member SET username = :username, password = :password, fullName = :fullName, birth = :birth, phoneNumber = :phoneNumber WHERE memberId = :memberId';
        $stmt = $this->conn->prepare($query);

        $this->username = htmlspecialchars(strip_tags($this->username));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->fullname = htmlspecialchars(strip_tags($this->fullname));
        $this->birth = htmlspecialchars(strip_tags($this->birth));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':username', $this->username);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':fullName', $this->fullname);
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
        $query = 'DELETE FROM member WHERE memberId = :memberId';
        $stmt = $this->conn->prepare($query);

        $this->memberId = htmlspecialchars(strip_tags($this->memberId));

        $stmt->bindParam(':memberId', $this->memberId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

}
