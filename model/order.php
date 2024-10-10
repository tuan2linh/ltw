<?php
class Order
{
    public $conn;

    public $orderId;
    public $payStatus;
    public $payDay;
    public $shipStatus;
    public $address;
    public $phoneNumber;
    public $cartId;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM `Order`';
        $stmt = $this->conn->prepare($query);
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

        $this->payStatus = $row['payStatus'];
        $this->payDay = $row['payDay'];
        $this->shipStatus = $row['shipStatus'];
        $this->address = $row['address'];
        $this->phoneNumber = $row['phoneNumber'];
        $this->cartId = $row['cartId'];
    }

    public function create()
    {
        $query = 'INSERT INTO `Order` SET orderId = :orderId, payStatus = :payStatus, payDay = :payDay, shipStatus = :shipStatus, address = :address, phoneNumber = :phoneNumber, cartId = :cartId';
        $stmt = $this->conn->prepare($query);

        $this->payStatus = htmlspecialchars(strip_tags($this->payStatus));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':payStatus', $this->payStatus);
        $stmt->bindParam(':payDay', $this->payDay);
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

    public function update()
    {
        $query = 'UPDATE `Order` SET payStatus = :payStatus, payDay = :payDay, shipStatus = :shipStatus, address = :address, phoneNumber = :phoneNumber, cartId = :cartId WHERE orderId = :orderId';
        $stmt = $this->conn->prepare($query);

        $this->payStatus = htmlspecialchars(strip_tags($this->payStatus));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phoneNumber = htmlspecialchars(strip_tags($this->phoneNumber));

        $stmt->bindParam(':orderId', $this->orderId);
        $stmt->bindParam(':payStatus', $this->payStatus);
        $stmt->bindParam(':payDay', $this->payDay);
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