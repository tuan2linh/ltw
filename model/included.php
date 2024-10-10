<?php
class Included
{
    public $conn;

    public $cartId;
    public $productId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Include';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Include WHERE cartId = ? AND productId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->cartId);
        $stmt->bindParam(2, $this->productId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create()
    {
        $query = 'INSERT INTO Include SET cartId = :cartId, productId = :productId';
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':productId', $this->productId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Include WHERE cartId = :cartId AND productId = :productId';
        $stmt = $this->conn->prepare($query);

        $this->cartId = htmlspecialchars(strip_tags($this->cartId));
        $this->productId = htmlspecialchars(strip_tags($this->productId));

        $stmt->bindParam(':cartId', $this->cartId);
        $stmt->bindParam(':productId', $this->productId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}