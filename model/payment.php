<?php
class Payment
{
    public $conn;

    public $memberId;
    public $cartId;
    public $orderId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Payment';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Payment WHERE memberId = ? AND cartId = ? AND orderId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->bindParam(2, $this->cartId);
        $stmt->bindParam(3, $this->orderId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create()
    {
        $query = 'INSERT INTO Payment SET memberId = :memberId, cartId = :cartId, orderId = :orderId';
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':orderId', $this->orderId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Payment WHERE memberId = :memberId AND cartId = :cartId AND orderId = :orderId';
        $stmt = $this->conn->prepare($query);

        $this->memberId = htmlspecialchars(strip_tags($this->memberId));
        $this->cartId = htmlspecialchars(strip_tags($this->cartId));
        $this->orderId = htmlspecialchars(strip_tags($this->orderId));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':orderId', $this->orderId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}