<?php
class Action {
    private $conn;
    private $table = 'Action';

    // Constructor to initialize database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Initialize daily actions if not exists
    private function initializeDailyActions() {
        try {
            $today = date('Y-m-d');
            $actions = [
                'create_user',
                'create_product',
                'product_buy',
                'create_order',
                'order_success', 
                'create_rating',
                'rating_good'
            ];

            foreach ($actions as $action) {
                $query = "INSERT IGNORE INTO " . $this->table . " 
                         (action, count, date) 
                         VALUES (:action, 0, :date)";
                
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':action', $action);
                $stmt->bindParam(':date', $today);
                $stmt->execute();
            }
            return true;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Increment action count for today
    private function incrementAction($actionType) {
        try {
            $today = date('Y-m-d');
            
            // Check if actions exist for today
            $checkQuery = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE date = :date";
            $stmt = $this->conn->prepare($checkQuery);
            $stmt->bindParam(':date', $today);
            $stmt->execute();
            
            if ($stmt->fetch(PDO::FETCH_ASSOC)['count'] == 0) {
                // Initialize actions for today
                $actions = [
                    'create_user',
                    'create_product',
                    'product_buy',
                    'create_order',
                    'order_success',
                    'create_rating',
                    'rating_good'
                ];

                foreach ($actions as $action) {
                    $insertQuery = "INSERT INTO " . $this->table . " 
                                 (action, count, date) 
                                 VALUES (:action, 0, :date)";
                    $stmt = $this->conn->prepare($insertQuery);
                    $stmt->bindParam(':action', $action);
                    $stmt->bindParam(':date', $today);
                    $stmt->execute();
                }
            }

            // Increment count for specific action
            $query = "UPDATE " . $this->table . " 
                     SET count = count + 1 
                     WHERE action = :action AND date = :date";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':action', $actionType);
            $stmt->bindParam(':date', $today);
            return $stmt->execute();

        } catch(PDOException $e) {
            error_log("Error incrementing action: " . $e->getMessage());
            return false;
        }
    }

    // Convenience methods for each action type
    public function logCreateUser() {
        return $this->incrementAction('create_user');
    }

    public function logCreateProduct() {
        return $this->incrementAction('create_product');
    }

    public function logProductBuy() {
        return $this->incrementAction('product_buy');
    }

    public function logCreateOrder() {
        return $this->incrementAction('create_order');
    }

    public function logOrderSuccess() {
        return $this->incrementAction('order_success');
    }

    public function logCreateRating() {
        return $this->incrementAction('create_rating');
    }

    public function logRatingGood() {
        return $this->incrementAction('rating_good');
    }

    // Get statistics for a specific date
    public function getStats($date = null) {
        try {
            $date = $date ?? date('Y-m-d');
            
            // Initialize actions if they don't exist for this date
            $checkQuery = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE date = :date";
            $stmt = $this->conn->prepare($checkQuery);
            $stmt->bindParam(':date', $date);
            $stmt->execute();
            
            if ($stmt->fetch(PDO::FETCH_ASSOC)['count'] == 0) {
                // Initialize actions for this date
                $actions = [
                    'create_user',
                    'create_product',
                    'product_buy',
                    'create_order',
                    'order_success',
                    'create_rating',
                    'rating_good'
                ];

                foreach ($actions as $action) {
                    $insertQuery = "INSERT INTO " . $this->table . " 
                                 (action, count, date) 
                                 VALUES (:action, 0, :date)";
                    $stmt = $this->conn->prepare($insertQuery);
                    $stmt->bindParam(':action', $action);
                    $stmt->bindParam(':date', $date);
                    $stmt->execute();
                }
            }

            // Get current action stats
            $query = "SELECT action, count FROM " . $this->table . " WHERE date = :date";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':date', $date);
            $stmt->execute();
            $actionStats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get totals from all tables
            $totalsQuery = "SELECT 
                (SELECT COUNT(*) FROM member) as total_members,
                (SELECT COUNT(*) FROM Product) as total_products,
                (SELECT COUNT(*) FROM `Order`) as total_orders,
                (SELECT COUNT(*) FROM Feedback) as total_feedback";
            
            $stmt = $this->conn->prepare($totalsQuery);
            $stmt->execute();
            $totals = $stmt->fetch(PDO::FETCH_ASSOC);

            // Combine both results
            return [
                'actions' => $actionStats ?: [],
                'totals' => $totals
            ];

        } catch(PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return false;
        }
    }
}

// Update response in getStats.php:
