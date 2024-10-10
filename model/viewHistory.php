<?php
class ViewHistory
{
    public $conn;

    public $memberId;
    public $productId;
    public $time;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM View_History';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM View_History WHERE memberId = ? AND productId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->bindParam(2, $this->productId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->time = $row['time'];
    }

    public function create()
    {
        $query = 'INSERT INTO View_History SET memberId = :memberId, productId = :productId, time = :time';
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':productId', $this->productId);
        $stmt->bindParam(':time', $this->time);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM View_History WHERE memberId = :memberId AND productId = :productId';
        $stmt = $this->conn->prepare($query);

        $this->memberId = htmlspecialchars(strip_tags($this->memberId));
        $this->productId = htmlspecialchars(strip_tags($this->productId));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':productId', $this->productId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}