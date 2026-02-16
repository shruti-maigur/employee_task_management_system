<?php
/**
 * Create Task Handler
 * Processes form submission for creating new tasks
 */

session_start();
require_once __DIR__ . '/../models/Task.php';

$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

try {
    // Get POST data
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $priority = isset($_POST['priority']) ? trim($_POST['priority']) : 'Medium';
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'Pending';
    $assigned_to = isset($_POST['assigned_to']) && !empty($_POST['assigned_to']) ? (int)$_POST['assigned_to'] : null;
    $due_date = isset($_POST['due_date']) ? trim($_POST['due_date']) : '';
    $created_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 1; // Default to admin if not in session

    // Instantiate Task
    $task = new Task();
    $task->title = $title;
    $task->description = $description;
    $task->priority = $priority;
    $task->status = $status;
    $task->assigned_to = $assigned_to;
    $task->due_date = $due_date ?: null;
    $task->created_by = $created_by;

    // Create task
    if ($task->createTask()) {
        $response['success'] = true;
        $response['message'] = 'Task created successfully';
        http_response_code(201);
    } else {
        $response['errors'] = $task->getErrors();
        $response['message'] = 'Failed to create task';
        http_response_code(400);
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Server error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
