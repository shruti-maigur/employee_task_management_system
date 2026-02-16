<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Management Dashboard</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --primary-color: #3498db;
            --danger-color: #e74c3c;
            --success-color: #27ae60;
            --warning-color: #f39c12;
            --info-color: #2ecc71;
            --light-bg: #ecf0f1;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .dashboard-header {
            background: linear-gradient(135deg, var(--primary-color) 0%, #2980b9 100%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .dashboard-header h1 {
            margin-bottom: 10px;
            font-weight: 700;
        }

        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-left: 4px solid var(--primary-color);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-card.pending {
            border-left-color: #f39c12;
        }

        .stat-card.in-progress {
            border-left-color: #3498db;
        }

        .stat-card.completed {
            border-left-color: #27ae60;
        }

        .stat-card h3 {
            color: var(--primary-color);
            font-size: 28px;
            margin-bottom: 5px;
            font-weight: 700;
        }

        .stat-card p {
            color: #7f8c8d;
            margin-bottom: 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .tasks-section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--light-bg);
        }

        .section-header h2 {
            margin: 0;
            color: #2c3e50;
            font-weight: 700;
        }

        .btn-create {
            background: var(--primary-color);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-create:hover {
            background: #2980b9;
            text-decoration: none;
            color: white;
        }

        .filter-container {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .filter-container select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }

        .table-responsive {
            overflow-x: auto;
        }

        .task-table {
            margin-bottom: 0;
        }

        .task-table thead {
            background-color: #ecf0f1;
        }

        .task-table th {
            color: #2c3e50;
            font-weight: 600;
            border-bottom: 2px solid #bdc3c7;
            padding: 15px;
        }

        .task-table td {
            padding: 15px;
            vertical-align: middle;
            border-bottom: 1px solid #ecf0f1;
        }

        .task-table tbody tr {
            transition: background-color 0.3s;
        }

        .task-table tbody tr:hover {
            background-color: #f8f9fa;
        }

        .task-title {
            font-weight: 600;
            color: #2c3e50;
            max-width: 300px;
            word-wrap: break-word;
        }

        .priority-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .priority-high {
            background-color: #fadbd8;
            color: #c0392b;
        }

        .priority-medium {
            background-color: #fef5e7;
            color: #d68910;
        }

        .priority-low {
            background-color: #d5f4e6;
            color: #117a65;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background-color: #fef5e7;
            color: #d68910;
        }

        .status-in-progress {
            background-color: #d6eaf8;
            color: #1b4965;
        }

        .status-completed {
            background-color: #d5f4e6;
            color: #117a65;
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .btn-sm {
            padding: 5px 10px;
            font-size: 13px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-edit {
            background-color: #f39c12;
            color: white;
        }

        .btn-edit:hover {
            background-color: #d68910;
            text-decoration: none;
            color: white;
        }

        .btn-delete {
            background-color: #e74c3c;
            color: white;
        }

        .btn-delete:hover {
            background-color: #c0392b;
            text-decoration: none;
            color: white;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #7f8c8d;
        }

        .empty-state i {
            font-size: 48px;
            color: #bdc3c7;
            margin-bottom: 15px;
        }

        .pagination-custom {
            margin-top: 20px;
            text-align: center;
        }

        .modal-header {
            border-bottom: 2px solid #ecf0f1;
        }

        .form-label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
        }

        .form-control, .form-select {
            border: 1px solid #bdc3c7;
            border-radius: 5px;
            padding: 10px 12px;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
        }

        .badge-count {
            display: inline-block;
            background-color: var(--danger-color);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-left: 5px;
        }

        @media (max-width: 768px) {
            .stats-container {
                grid-template-columns: repeat(2, 1fr);
            }

            .filter-container {
                flex-direction: column;
            }

            .filter-container select {
                width: 100%;
            }

            .action-buttons {
                flex-direction: column;
            }

            .btn-sm {
                width: 100%;
            }

            .section-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .section-header .btn-create {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <!-- Dashboard Header -->
    <div class="container-fluid">
        <div class="dashboard-header">
            <h1><i class="fas fa-tasks"></i> Task Management Dashboard</h1>
            <p>Manage and track all your tasks efficiently</p>
        </div>

        <!-- Statistics Cards -->
        <div class="stats-container">
            <div class="stat-card">
                <h3 id="totalTasks">0</h3>
                <p><i class="fas fa-list-check"></i> Total Tasks</p>
            </div>
            <div class="stat-card pending">
                <h3 id="pendingTasks">0</h3>
                <p><i class="fas fa-clock"></i> Pending</p>
            </div>
            <div class="stat-card in-progress">
                <h3 id="inProgressTasks">0</h3>
                <p><i class="fas fa-spinner"></i> In Progress</p>
            </div>
            <div class="stat-card completed">
                <h3 id="completedTasks">0</h3>
                <p><i class="fas fa-check-circle"></i> Completed</p>
            </div>
        </div>

        <!-- Tasks Section -->
        <div class="tasks-section">
            <div class="section-header">
                <h2><i class="fas fa-list"></i> All Tasks</h2>
                <button class="btn-create" data-bs-toggle="modal" data-bs-target="#createTaskModal">
                    <i class="fas fa-plus-circle"></i> Create New Task
                </button>
            </div>

            <!-- Filters -->
            <div class="filter-container">
                <select id="statusFilter" class="form-select">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <select id="priorityFilter" class="form-select">
                    <option value="">All Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button id="resetFiltersBtn" class="btn btn-secondary">
                    <i class="fas fa-redo"></i> Reset Filters
                </button>
            </div>

            <!-- Tasks Table -->
            <div class="table-responsive">
                <table id="tasksTable" class="table task-table">
                    <thead>
                        <tr>
                            <th style="width: 30%;">Task Title</th>
                            <th style="width: 15%;">Priority</th>
                            <th style="width: 15%;">Status</th>
                            <th style="width: 15%;">Due Date</th>
                            <th style="width: 15%;">Assigned To</th>
                            <th style="width: 10%;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tasksBody">
                        <tr>
                            <td colspan="6" class="text-center text-muted py-4">
                                <i class="fas fa-spinner fa-spin"></i> Loading tasks...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state" style="display: none;">
                <i class="fas fa-inbox"></i>
                <h5>No tasks found</h5>
                <p>Create a new task to get started</p>
            </div>
        </div>
    </div>

    <?php
    // Include modals
    include __DIR__ . '/create_task_modal.php';
    include __DIR__ . '/edit_task_modal.php';
    ?>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        // Load tasks on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadTasks();

            // Add filter listeners
            document.getElementById('statusFilter').addEventListener('change', loadTasks);
            document.getElementById('priorityFilter').addEventListener('change', loadTasks);
            document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
        });

        /**
         * Load all tasks and update dashboard
         */
        function loadTasks() {
            const statusFilter = document.getElementById('statusFilter').value;
            const priorityFilter = document.getElementById('priorityFilter').value;

            let url = '../api/get_all_tasks.php';
            const params = new URLSearchParams();
            
            if (statusFilter) params.append('status', statusFilter);
            if (priorityFilter) params.append('priority', priorityFilter);

            if (params.toString()) {
                url += '?' + params.toString();
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateStats(data);
                        displayTasks(data.tasks);
                    }
                })
                .catch(error => {
                    console.error('Error loading tasks:', error);
                    document.getElementById('tasksBody').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading tasks</td></tr>';
                });
        }

        /**
         * Update dashboard statistics
         */
        function updateStats(data) {
            document.getElementById('totalTasks').textContent = data.total_tasks || 0;
            document.getElementById('pendingTasks').textContent = data.pending_tasks || 0;
            document.getElementById('inProgressTasks').textContent = data.in_progress_tasks || 0;
            document.getElementById('completedTasks').textContent = data.completed_tasks || 0;
        }

        /**
         * Display tasks in table
         */
        function displayTasks(tasks) {
            const tbody = document.getElementById('tasksBody');
            const emptyState = document.getElementById('emptyState');

            if (tasks.length === 0) {
                tbody.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            tbody.style.display = 'table-body-group';
            emptyState.style.display = 'none';

            let html = '';
            tasks.forEach(task => {
                const dueDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : '-';
                const assignedTo = task.assigned_employee || '-';
                
                const priorityClass = 'priority-' + task.priority.toLowerCase();
                const statusClass = 'status-' + task.status.toLowerCase().replace(' ', '-');

                html += `
                    <tr>
                        <td>
                            <div class="task-title">${escapeHtml(task.title)}</div>
                        </td>
                        <td>
                            <span class="priority-badge ${priorityClass}">${task.priority}</span>
                        </td>
                        <td>
                            <span class="status-badge ${statusClass}">${task.status}</span>
                        </td>
                        <td>${dueDate}</td>
                        <td>${escapeHtml(assignedTo)}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-sm btn-edit" onclick="editTask(${task.id})" title="Edit Task">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
        }

        /**
         * Reset filters
         */
        function resetFilters() {
            document.getElementById('statusFilter').value = '';
            document.getElementById('priorityFilter').value = '';
            loadTasks();
        }

        /**
         * Escape HTML to prevent XSS
         */
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    </script>
</body>
</html>
