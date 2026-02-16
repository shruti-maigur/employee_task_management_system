<?php
/**
 * Database Configuration Class
 * Handles database connection using MySQLi
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'employee_task_db';
    private $username = 'root';
    private $password = '';
    private $conn;

    /**
     * Connect to database
     */
    public function connect() {
        $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);

        // Check connection
        if ($this->conn->connect_error) {
            die('Database Connection Error: ' . $this->conn->connect_error);
        }

        // Set charset to UTF-8
        $this->conn->set_charset("utf8mb4");

        return $this->conn;
    }

    /**
     * Get connection
     */
    public function getConnection() {
        if ($this->conn === null) {
            $this->connect();
        }
        return $this->conn;
    }

    /**
     * Close connection
     */
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>
