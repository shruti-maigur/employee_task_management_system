<?php
/**
 * API - Get All Tasks
 * Fetches all tasks with optional filters
 */

require_once __DIR__ . '/../models/Task.php';

$response = [
    'success' => true,
    'tasks' => [],
    'total_tasks' => 0,
    'pending_tasks' => 0,
    'in_progress_tasks' => 0,
    'completed_tasks' => 0
];

try {
    $task = new Task();

    // Get filter parameters
    $filters = [
        'status' => isset($_GET['status']) ? trim($_GET['status']) : '',
        'priority' => isset($_GET['priority']) ? trim($_GET['priority']) : '',
        'assigned_to' => isset($_GET['assigned_to']) ? (int)$_GET['assigned_to'] : ''
    ];

    // Remove empty filters
    $filters = array_filter($filters);

    // Fetch tasks
    $response['tasks'] = $task->getAllTasks($filters);

    // Fetch task counts
    $response['total_tasks'] = $task->getTotalCount();
    $response['pending_tasks'] = $task->getCountByStatus('Pending');
    $response['in_progress_tasks'] = $task->getCountByStatus('In Progress');
    $response['completed_tasks'] = $task->getCountByStatus('Completed');

    http_response_code(200);
} catch (Exception $e) {
    http_response_code(500);
    $response['success'] = false;
    $response['message'] = 'Server error: ' . $e->getMessage();
}

header('Content-Type: application/json');
echo json_encode($response);
?>
