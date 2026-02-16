<?php
/**
 * Task Model Class
 * Handles all task-related database operations (CRUD)
 */

require_once __DIR__ . '/../config/Database.php';

class Task {
    private $db;
    private $table = 'tasks';
    private $errors = [];

    // Task Properties
    public $id;
    public $title;
    public $description;
    public $priority;
    public $status;
    public $assigned_to;
    public $created_by;
    public $due_date;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    /**
     * Get all tasks with optional filters
     * @param array $filters - Filter criteria
     * @return array - Array of tasks or empty array
     */
    public function getAllTasks($filters = []) {
        $query = "SELECT t.*, 
                  CONCAT(u.first_name, ' ', u.last_name) as assigned_employee,
                  CONCAT(c.first_name, ' ', c.last_name) as created_by_name
                  FROM " . $this->table . " t
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN users c ON t.created_by = c.id
                  WHERE 1=1";

        $params = [];
        $types = '';

        // Add filters
        if (!empty($filters['status'])) {
            $query .= " AND t.status = ?";
            $params[] = $filters['status'];
            $types .= 's';
        }

        if (!empty($filters['priority'])) {
            $query .= " AND t.priority = ?";
            $params[] = $filters['priority'];
            $types .= 's';
        }

        if (!empty($filters['assigned_to'])) {
            $query .= " AND t.assigned_to = ?";
            $params[] = (int)$filters['assigned_to'];
            $types .= 'i';
        }

        // Order by due date and priority
        $query .= " ORDER BY t.due_date ASC, t.priority DESC";

        $stmt = $this->db->prepare($query);

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
        $result = $stmt->get_result();
        $tasks = $result->fetch_all(MYSQLI_ASSOC);

        $stmt->close();

        return $tasks ? $tasks : [];
    }

    /**
     * Get single task by ID
     * @param int $id - Task ID
     * @return array|null - Task data or null
     */
    public function getTaskById($id) {
        $query = "SELECT t.*, 
                  CONCAT(u.first_name, ' ', u.last_name) as assigned_employee,
                  CONCAT(c.first_name, ' ', c.last_name) as created_by_name
                  FROM " . $this->table . " t
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN users c ON t.created_by = c.id
                  WHERE t.id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $task = $result->fetch_assoc();

        $stmt->close();

        return $task ? $task : null;
    }

    /**
     * Create a new task
     * @return bool - Success or failure
     */
    public function createTask() {
        // Validate input
        if (!$this->validate()) {
            return false;
        }

        $query = "INSERT INTO " . $this->table . "
                  (title, description, priority, status, assigned_to, created_by, due_date)
                  VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->db->prepare($query);

        // Bind parameters
        $stmt->bind_param(
            'ssssiss',
            $this->title,
            $this->description,
            $this->priority,
            $this->status,
            $this->assigned_to,
            $this->created_by,
            $this->due_date
        );

        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            $this->errors[] = 'Error creating task: ' . $this->db->error;
            $stmt->close();
            return false;
        }
    }

    /**
     * Update an existing task
     * @return bool - Success or failure
     */
    public function updateTask() {
        // Validate input
        if (!$this->validate()) {
            return false;
        }

        // Prevent ID from being null
        if (empty($this->id)) {
            $this->errors[] = 'Task ID is required for update';
            return false;
        }

        $query = "UPDATE " . $this->table . "
                  SET title = ?, description = ?, priority = ?, status = ?, 
                      assigned_to = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
                  WHERE id = ?";

        $stmt = $this->db->prepare($query);

        // Bind parameters
        $stmt->bind_param(
            'ssssssi',
            $this->title,
            $this->description,
            $this->priority,
            $this->status,
            $this->assigned_to,
            $this->due_date,
            $this->id
        );

        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            $this->errors[] = 'Error updating task: ' . $this->db->error;
            $stmt->close();
            return false;
        }
    }

    /**
     * Delete a task
     * @param int $id - Task ID
     * @return bool - Success or failure
     */
    public function deleteTask($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            $stmt->close();
            return true;
        } else {
            $this->errors[] = 'Error deleting task: ' . $this->db->error;
            $stmt->close();
            return false;
        }
    }

    /**
     * Validate task data
     * @return bool - Valid or not
     */
    private function validate() {
        $this->errors = [];

        // Validate title
        if (empty(trim($this->title))) {
            $this->errors[] = 'Task title is required';
        } else if (strlen(trim($this->title)) > 255) {
            $this->errors[] = 'Task title cannot exceed 255 characters';
        }

        // Validate priority
        $valid_priorities = ['Low', 'Medium', 'High'];
        if (empty($this->priority) || !in_array($this->priority, $valid_priorities)) {
            $this->errors[] = 'Invalid priority level';
        }

        // Validate status
        $valid_statuses = ['Pending', 'In Progress', 'Completed'];
        if (empty($this->status) || !in_array($this->status, $valid_statuses)) {
            $this->errors[] = 'Invalid status';
        }

        // Validate due date if provided
        if (!empty($this->due_date)) {
            if (!$this->isValidDate($this->due_date)) {
                $this->errors[] = 'Invalid due date format (use YYYY-MM-DD)';
            }
        }

        // Validate created_by if this is a new task
        if (empty($this->id) && empty($this->created_by)) {
            $this->errors[] = 'Creator ID is required for new tasks';
        }

        return count($this->errors) === 0;
    }

    /**
     * Check if date is valid and in correct format
     * @param string $date - Date to validate
     * @return bool
     */
    private function isValidDate($date) {
        $d = \DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }

    /**
     * Get all employees for dropdown
     * @return array - Array of employees
     */
    public function getEmployees() {
        $query = "SELECT id, CONCAT(first_name, ' ', last_name) as full_name, email 
                  FROM users 
                  WHERE role IN ('Employee', 'Manager') AND status = 'Active'
                  ORDER BY first_name, last_name";

        $result = $this->db->query($query);
        $employees = $result->fetch_all(MYSQLI_ASSOC);

        return $employees ? $employees : [];
    }

    /**
     * Get error messages
     * @return array - Array of error messages
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Get task count by status
     * @param string $status - Task status
     * @return int - Count of tasks
     */
    public function getCountByStatus($status) {
        $query = "SELECT COUNT(*) as count FROM " . $this->table . " WHERE status = ?";
        
        $stmt = $this->db->prepare($query);
        $stmt->bind_param('s', $status);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $stmt->close();
        
        return (int)$row['count'];
    }

    /**
     * Get total task count
     * @return int - Total tasks
     */
    public function getTotalCount() {
        $query = "SELECT COUNT(*) as count FROM " . $this->table;
        $result = $this->db->query($query);
        $row = $result->fetch_assoc();
        
        return (int)$row['count'];
    }
}
?>
