<?php
class Product
{
    public $conn;

    public $productId;
    public $productName;
    public $price;
    public $image;
    public $description;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM Product';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM Product WHERE productId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->productId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->productName = $row['productName'];
        $this->price = $row['price'];
        $this->image = $row['image'];
        $this->description = $row['description'];
    }

    public function create()
    {
        try {
            // Remove productId from INSERT since it's auto-increment
            $query = 'INSERT INTO Product 
                     (productName, price, image, description) 
                     VALUES 
                     (:productName, :price, :image, :description)';
            
            $stmt = $this->conn->prepare($query);

            // Sanitize inputs
            $this->productName = htmlspecialchars(strip_tags($this->productName));
            $this->price = htmlspecialchars(strip_tags($this->price));
            $this->image = htmlspecialchars(strip_tags($this->image));
            $this->description = htmlspecialchars(strip_tags($this->description));

            // Bind parameters
            $stmt->bindParam(':productName', $this->productName);
            $stmt->bindParam(':price', $this->price);
            $stmt->bindParam(':image', $this->image);
            $stmt->bindParam(':description', $this->description);

            if ($stmt->execute()) {
                return true;
            }

            throw new Exception($stmt->errorInfo()[2]);
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    public function update()
    {
        $query = 'UPDATE Product SET productName = :productName, price = :price, image = :image, description = :description WHERE productId = :productId';
        $stmt = $this->conn->prepare($query);

        $this->productName = htmlspecialchars(strip_tags($this->productName));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bindParam(':productId', $this->productId);
        $stmt->bindParam(':productName', $this->productName);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':image', $this->image);
        $stmt->bindParam(':description', $this->description);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM Product WHERE productId = :productId';
        $stmt = $this->conn->prepare($query);

        $this->productId = htmlspecialchars(strip_tags($this->productId));

        $stmt->bindParam(':productId', $this->productId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}