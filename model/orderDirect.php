<?php
class OrderDirect
{
    private $conn;
    
    // Properties
    public $orderId;
    public $productId;
    public $quantity;

    // Constructor with DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Read all order details
    public function read($orderId = null)
    {
        if ($orderId) {
            $query = 'SELECT od.*, p.productName, p.price, p.image 
                     FROM OrderDirect od
                     INNER JOIN Product p ON od.productId = p.productId
                     WHERE od.orderId = :orderId';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':orderId', $orderId);
        } else {
            $query = 'SELECT * FROM OrderDirect';
            $stmt = $this->conn->prepare($query);
        }
        
        $stmt->execute();
        return $stmt;
    }

    // Create new order detail
    public function create()
    {
        $query = 'INSERT INTO OrderDirect SET 
                  orderId = :orderId,
                  productId = :productId,
                  quantity = :quantity';

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->orderId = htmlspecialchars(strip_tags($this->orderId));
        $this->productId = htmlspecialchars(strip_tags($this->productId));
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));

        // Bind parameters
        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':productId', $this->productId);
        $stmt->bindParam(':quantity', $this->quantity);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    // Update order detail
    public function update()
    {
        $query = 'UPDATE OrderDirect SET
                  quantity = :quantity
                  WHERE orderId = :orderId AND productId = :productId';

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->quantity = htmlspecialchars(strip_tags($this->quantity));
        $this->orderId = htmlspecialchars(strip_tags($this->orderId));
        $this->productId = htmlspecialchars(strip_tags($this->productId));

        // Bind parameters
        $stmt->bindParam(':quantity', $this->quantity);
        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':productId', $this->productId);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    // Delete order detail
    public function delete()
    {
        $query = 'DELETE FROM OrderDirect 
                  WHERE orderId = :orderId AND productId = :productId';
                  
        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->orderId = htmlspecialchars(strip_tags($this->orderId));
        $this->productId = htmlspecialchars(strip_tags($this->productId));

        // Bind parameters
        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':productId', $this->productId);

        try {
            if ($stmt->execute()) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }
}