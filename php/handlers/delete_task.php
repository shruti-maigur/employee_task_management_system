<?php
/**
 * Delete Task Handler
 * Processes deletion of tasks with confirmation
 */

session_start();
require_once __DIR__ . '/../models/Task.php';

$response = [
    'success' => false,
    'message' => ''
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

    // Validate task ID
    if (empty($task_id)) {
        http_response_code(400);
        $response['message'] = 'Task ID is required';
        echo json_encode($response);
        exit;
    }

    // Verify task exists before deletion
    $task = new Task();
    $existing_task = $task->getTaskById($task_id);
    if (!$existing_task) {
        http_response_code(404);
        $response['message'] = 'Task not found';
        echo json_encode($response);
        exit;
    }

    // Delete task (prepared statement prevents SQL injection)
    if ($task->deleteTask($task_id)) {
        $response['success'] = true;
        $response['message'] = 'Task deleted successfully';
        http_response_code(200);
    } else {
        $response['message'] = 'Failed to delete task';
        http_response_code(400);
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Server error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
