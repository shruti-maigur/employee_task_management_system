<?php
/**
 * Update Task Handler
 * Processes form submission for updating existing tasks
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
    $task_id = isset($_POST['task_id']) ? (int)$_POST['task_id'] : null;
    $title = isset($_POST['title']) ? trim($_POST['title']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $priority = isset($_POST['priority']) ? trim($_POST['priority']) : 'Medium';
    $status = isset($_POST['status']) ? trim($_POST['status']) : 'Pending';
    $assigned_to = isset($_POST['assigned_to']) && !empty($_POST['assigned_to']) ? (int)$_POST['assigned_to'] : null;
    $due_date = isset($_POST['due_date']) ? trim($_POST['due_date']) : '';

    // Validate task ID
    if (empty($task_id)) {
        http_response_code(400);
        $response['message'] = 'Task ID is required';
        echo json_encode($response);
        exit;
    }

    // Verify task exists
    $task = new Task();
    $existing_task = $task->getTaskById($task_id);
    if (!$existing_task) {
        http_response_code(404);
        $response['message'] = 'Task not found';
        echo json_encode($response);
        exit;
    }

    // Update task properties
    $task->id = $task_id;
    $task->title = $title;
    $task->description = $description;
    $task->priority = $priority;
    $task->status = $status;
    $task->assigned_to = $assigned_to;
    $task->due_date = $due_date ?: null;

    // Update task
    if ($task->updateTask()) {
        $response['success'] = true;
        $response['message'] = 'Task updated successfully';
        http_response_code(200);
    } else {
        $response['errors'] = $task->getErrors();
        $response['message'] = 'Failed to update task';
        http_response_code(400);
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Server error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
