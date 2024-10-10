<?php
class Cart
{
    public $conn;

    public $cartId;
    public $createDay;
    public $memberId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Cart';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Cart WHERE cartId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->cartId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->createDay = $row['createDay'];
        $this->memberId = $row['memberId'];
    }

    public function create()
    {
        $query = 'INSERT INTO Cart SET cartId = :cartId, createDay = :createDay, memberId = :memberId';
        $stmt = $this->conn->prepare($query);

        $this->createDay = htmlspecialchars(strip_tags($this->createDay));

        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':createDay', $this->createDay);
        $stmt->bindParam(':memberId', $this->memberId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE Cart SET createDay = :createDay, memberId = :memberId WHERE cartId = :cartId';
        $stmt = $this->conn->prepare($query);

        $this->createDay = htmlspecialchars(strip_tags($this->createDay));

        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':createDay', $this->createDay);
        $stmt->bindParam(':memberId', $this->memberId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Cart WHERE cartId = :cartId';
        $stmt = $this->conn->prepare($query);

        $this->cartId = htmlspecialchars(strip_tags($this->cartId));

        $stmt->bindParam(':cartId', $this->cartId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}

