<?php
/**
 * API - Get Task by ID
 * Fetches task data for editing
 */

require_once __DIR__ . '/../models/Task.php';

$response = [
    'success' => false,
    'task' => null,
    'message' => ''
];

try {
    // Get task ID from query parameter
    $task_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (empty($task_id)) {
        http_response_code(400);
        $response['message'] = 'Task ID is required';
        echo json_encode($response);
        exit;
    }

    // Fetch task
    $task = new Task();
    $task_data = $task->getTaskById($task_id);

    if ($task_data) {
        $response['success'] = true;
        $response['task'] = $task_data;
    } else {
        http_response_code(404);
        $response['message'] = 'Task not found';
    }
} catch (Exception $e) {
    http_response_code(500);
    $response['message'] = 'Server error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
