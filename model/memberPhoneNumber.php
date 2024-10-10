<?php

class MemberPhoneNumber
{
    public $conn;

    public $memberId;
    public $phoneNumberId;
    public $phoneNumber;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Member_Phone_Number';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Member_Phone_Number WHERE memberId = ? AND phoneNumberId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->bindParam(2, $this->phoneNumberId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->phoneNumber = $row['phoneNumber'];
    }

    public function create()
    {
        $query = 'INSERT INTO Member_Phone_Number SET memberId = :memberId, phoneNumberId = :phoneNumberId, phoneNumber = :phoneNumber';
        $stmt = $this->conn->prepare($query);

        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':phoneNumberId', $this->phoneNumberId);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE Member_Phone_Number SET phoneNumber = :phoneNumber WHERE memberId = :memberId AND phoneNumberId = :phoneNumberId';
        $stmt = $this->conn->prepare($query);

        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':phoneNumberId', $this->phoneNumberId);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Member_Phone_Number WHERE memberId = :memberId AND phoneNumberId = :phoneNumberId';
        $stmt = $this->conn->prepare($query);

        $this->memberId = htmlspecialchars(strip_tags($this->memberId));
        $this->phoneNumberId = htmlspecialchars(strip_tags($this->phoneNumberId));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':phoneNumberId', $this->phoneNumberId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}


