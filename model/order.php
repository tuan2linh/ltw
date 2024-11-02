<?php
class Order
{
    public $conn;

    public $orderId;
    public $payStatus;
    public $dayBooking;
    public $shipStatus;
    public $address;
    public $phoneNumber;
    public $memberId;
    public $cartId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read($memberId = null)
    {
        // if ($memberId) {
        //     $query = 'SELECT o.* 
        //             FROM `Order` o
        //             INNER JOIN Cart c ON o.cartId = c.cartId
        //             WHERE c.memberId = :memberId';
        //     $stmt = $this->conn->prepare($query);
        //     $stmt->bindParam(':memberId', $memberId);
        // } else {
        //     $query = 'SELECT * FROM `Order`';
        //     $stmt = $this->conn->prepare($query);
        // }
        
        // $stmt->execute();
        // return $stmt;
        if ($memberId) {
            $query = 'SELECT * FROM `Order` WHERE memberId = :memberId';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':memberId', $memberId);
        } else {
            $query = 'SELECT * FROM `Order`';
            $stmt = $this->conn->prepare($query);
        }
        $stmt->execute();
        return $stmt;
    }

    public function show()
{
    $query = 'SELECT * FROM `Order` WHERE orderId = ?';
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->orderId);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Set object properties
        $this->payStatus = $row['payStatus'];
        $this->dayBooking = $row['dayBooking'];
        $this->shipStatus = $row['shipStatus'];
        $this->address = $row['address'];
        $this->phoneNumber = $row['phoneNumber'];
        $this->memberId = $row['memberId'];
        $this->cartId = $row['cartId'];
        
        return $row; // Return the fetched data
    }
    
    return null;
}

    public function create()
    {
        $query = 'INSERT INTO `Order` SET payStatus = :payStatus, dayBooking = :dayBooking,Reciever = :Reciever, shipStatus = :shipStatus, address = :address, phoneNumber = :phoneNumber,memberId = :memberId, cartId = :cartId';
        $stmt = $this->conn->prepare($query);

        $this->payStatus = htmlspecialchars(strip_tags($this->payStatus));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':payStatus', $this->payStatus);
        $stmt->bindParam(':dayBooking', $this->dayBooking);
        $stmt->bindParam(':Reciever', $this->Reciever);
        $stmt->bindParam(':shipStatus', $this->shipStatus);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);
        $stmt->bindParam(':memberId', $this->memberId);
        $stmt->bindParam(':cartId', $this->cartId);

        try {
            if ($stmt->execute()) {
                return $this->conn->lastInsertId(); // Return new order ID
            }
            printf("Error: %s.\n", $stmt->error);
            return null; // Return null on failure
        } catch (Exception $e) {
            printf("Error: %s.\n", $e->getMessage());
            return null;
        }
    }

    public function update()
    {
        $query = 'UPDATE `Order` SET payStatus = :payStatus, dayBooking = :dayBooking, shipStatus = :shipStatus, address = :address, phoneNumber = :phoneNumber, cartId = :cartId WHERE orderId = :orderId';
        $stmt = $this->conn->prepare($query);

        $this->payStatus = htmlspecialchars(strip_tags($this->payStatus));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':payStatus', $this->payStatus);
        $stmt->bindParam(':dayBooking', $this->dayBooking);
        $stmt->bindParam(':shipStatus', $this->shipStatus);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':phoneNumber', $this->phoneNumber);
        $stmt->bindParam(':cartId', $this->cartId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM `Order` WHERE orderId = :orderId';
        $stmt = $this->conn->prepare($query);

        $this->orderId = htmlspecialchars(strip_tags($this->orderId));

        $stmt->bindParam(':orderId', $this->orderId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}