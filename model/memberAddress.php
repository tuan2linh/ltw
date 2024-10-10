<?php
class MemberAddress
{
    public $conn;

    public $memberId;
    public $addressId;
    public $address;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Member_Address';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Member_Address WHERE memberId = ? AND addressId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->bindParam(2, $this->addressId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->address = $row['address'];
    }

    public function create()
    {
        $query = 'INSERT INTO Member_Address SET memberId = :memberId, addressId = :addressId, address = :address';
        $stmt = $this->conn->prepare($query);

        $this->address = htmlspecialchars(strip_tags($this->address));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':addressId', $this->addressId);
        $stmt->bindParam(':address', $this->address);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE Member_Address SET address = :address WHERE memberId = :memberId AND addressId = :addressId';
        $stmt = $this->conn->prepare($query);

        $this->address = htmlspecialchars(strip_tags($this->address));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':addressId', $this->addressId);
        $stmt->bindParam(':address', $this->address);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Member_Address WHERE memberId = :memberId AND addressId = :addressId';
        $stmt = $this->conn->prepare($query);

        $this->memberId = htmlspecialchars(strip_tags($this->memberId));
        $this->addressId = htmlspecialchars(strip_tags($this->addressId));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':addressId', $this->addressId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}
