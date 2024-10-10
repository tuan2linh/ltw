<?php
class Feedback
{
    public $conn;

    public $memberId;
    public $productId;
    public $comment;
    public $rating;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Feedback';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Feedback WHERE memberId = ? AND productId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->memberId);
        $stmt->bindParam(2, $this->productId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->comment = $row['comment'];
        $this->rating = $row['rating'];
    }

    public function create()
    {
        $query = 'INSERT INTO Feedback SET memberId = :memberId, productId = :productId, comment = :comment, rating = :rating';
        $stmt = $this->conn->prepare($query);

        $this->comment = htmlspecialchars(strip_tags($this->comment));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':productId', $this->productId);
        $stmt->bindParam(':comment', $this->comment);
        $stmt->bindParam(':rating', $this->rating);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function update()
    {
        $query = 'UPDATE Feedback SET comment = :comment, rating = :rating WHERE memberId = :memberId AND productId = :productId';
        $stmt = $this->conn->prepare($query);

        $this->comment = htmlspecialchars(strip_tags($this->comment));

        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':productId', $this->productId);
        $stmt->bindParam(':comment', $this->comment);
        $stmt->bindParam(':rating', $this->rating);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Feedback WHERE memberId = :memberId AND productId = :productId';
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