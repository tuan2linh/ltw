<?php
class AdminActionHistory
{
    public $conn;

    public $actionId;
    public $adminId;
    public $action;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function read()
    {
        $query = 'SELECT * FROM AdminAction_History';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function show()
    {
        $query = 'SELECT * FROM AdminAction_History WHERE actionId = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->actionId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->adminId = $row['adminId'];
        $this->action = $row['action'];
    }

    public function create()
    {
        try {
            // Get current table count
            $countQuery = "SELECT COUNT(*) as count FROM AdminAction_History";
            $countStmt = $this->conn->prepare($countQuery);
            $countStmt->execute();
            $count = $countStmt->fetch(PDO::FETCH_ASSOC)['count'];

            // Set new actionId as count + 1
            $this->actionId = $count + 1;

            // Insert with calculated actionId
            $query = 'INSERT INTO AdminAction_History 
                     SET actionId = :actionId, adminId = :adminId, action = :action';
            $stmt = $this->conn->prepare($query);

            $this->action = htmlspecialchars(strip_tags($this->action));

            $stmt->bindParam(':actionId', $this->actionId);
            $stmt->bindParam(':adminId', $this->adminId);
            $stmt->bindParam(':action', $this->action);

            if ($stmt->execute()) {
                return true;
            }

            throw new Exception($stmt->error);

        } catch (Exception $e) {
            printf("Error: %s.\n", $e->getMessage());
            return false;
        }
    }

    public function update()
    {
        $query = 'UPDATE AdminAction_History SET adminId = :adminId, action = :action WHERE actionId = :actionId';
        $stmt = $this->conn->prepare($query);

        $this->action = htmlspecialchars(strip_tags($this->action));

        $stmt->bindParam(':actionId', $this->actionId);
        $stmt->bindParam(':adminId', $this->adminId);
        $stmt->bindParam(':action', $this->action);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    public function delete()
    {
        $query = 'DELETE FROM AdminAction_History WHERE actionId = :actionId';
        $stmt = $this->conn->prepare($query);

        $this->actionId = htmlspecialchars(strip_tags($this->actionId));

        $stmt->bindParam(':actionId', $this->actionId);

        if ($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);

        return false;
    }
}
