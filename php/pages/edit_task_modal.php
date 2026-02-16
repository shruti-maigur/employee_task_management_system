<?php
/**
 * Edit Task Page/Modal
 * Shows form to edit existing task
 */

require_once __DIR__ . '/../models/Task.php';

$task = new Task();
$employees = $task->getEmployees();

// Get task ID from URL parameter
$task_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$task_data = $task_id ? $task->getTaskById($task_id) : null;
?>

<!-- Edit Task Modal -->
<div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
                <h5 class="modal-title" id="editTaskModalLabel">
                    <i class="fas fa-edit"></i> Edit Task
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="editTaskForm" method="POST" action="../handlers/update_task.php">
                <input type="hidden" id="editTaskId" name="task_id">
                
                <div class="modal-body">
                    <!-- Title -->
                    <div class="mb-3">
                        <label for="editTaskTitle" class="form-label">Task Title <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="editTaskTitle" name="title" placeholder="Enter task title" required maxlength="255">
                        <div class="invalid-feedback" id="titleError"></div>
                    </div>

                    <!-- Description -->
                    <div class="mb-3">
                        <label for="editTaskDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="editTaskDescription" name="description" rows="4" placeholder="Enter task description (optional)"></textarea>
                    </div>

                    <!-- Priority and Status Row -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editTaskPriority" class="form-label">Priority <span class="text-danger">*</span></label>
                                <select class="form-select" id="editTaskPriority" name="priority" required>
                                    <option value="Low">Low</option>
                                    <option value="Medium" selected>Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editTaskStatus" class="form-label">Status <span class="text-danger">*</span></label>
                                <select class="form-select" id="editTaskStatus" name="status" required>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Due Date and Assigned To Row -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editTaskDueDate" class="form-label">Due Date</label>
                                <input type="date" class="form-control" id="editTaskDueDate" name="due_date">
                                <small class="text-muted">Leave empty if no due date</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="editTaskAssignedTo" class="form-label">Assign to Employee</label>
                                <select class="form-select" id="editTaskAssignedTo" name="assigned_to">
                                    <option value="">-- Select Employee --</option>
                                    <?php foreach ($employees as $emp): ?>
                                        <option value="<?php echo $emp['id']; ?>">
                                            <?php echo htmlspecialchars($emp['full_name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Created By Info -->
                    <div class="alert alert-info" role="alert">
                        <small>
                            Created by: <strong id="createdByName">-</strong> | 
                            Created: <strong id="createdAtDate">-</strong>
                        </small>
                    </div>

                    <!-- Error Messages -->
                    <div id="editTaskErrors" class="alert alert-danger d-none" role="alert">
                        <ul id="editErrorList" class="mb-0"></ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="deleteTaskBtn" style="margin-right: auto;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button type="submit" class="btn btn-warning" id="editTaskBtn">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Function to load task data and show edit modal
function editTask(taskId) {
    fetch(`../api/get_task.php?id=${taskId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.task) {
                const task = data.task;
                
                // Fill form fields
                document.getElementById('editTaskId').value = task.id;
                document.getElementById('editTaskTitle').value = task.title || '';
                document.getElementById('editTaskDescription').value = task.description || '';
                document.getElementById('editTaskPriority').value = task.priority || 'Medium';
                document.getElementById('editTaskStatus').value = task.status || 'Pending';
                document.getElementById('editTaskDueDate').value = task.due_date || '';
                document.getElementById('editTaskAssignedTo').value = task.assigned_to || '';
                
                // Show creator info
                document.getElementById('createdByName').textContent = task.created_by_name || '';
                document.getElementById('createdAtDate').textContent = new Date(task.created_at).toLocaleDateString();
                
                // Clear errors
                document.getElementById('editTaskErrors').classList.add('d-none');
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
                modal.show();
            }
        })
        .catch(error => console.error('Error:', error));
}

// Delete Task Button
document.getElementById('deleteTaskBtn').addEventListener('click', function() {
    const taskId = document.getElementById('editTaskId').value;
    
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        deleteTask(taskId);
    }
});

// Delete Task Function
function deleteTask(taskId) {
    const formData = new FormData();
    formData.append('task_id', taskId);

    fetch('../handlers/delete_task.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Task deleted successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
            modal.hide();
            location.reload();
        } else {
            alert('Error deleting task: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the task.');
    });
}

// Edit Task Form Handler
document.getElementById('editTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const editTaskBtn = document.getElementById('editTaskBtn');
    const errorDiv = document.getElementById('editTaskErrors');
    const errorList = document.getElementById('editErrorList');

    // Disable button during submission
    editTaskBtn.disabled = true;
    editTaskBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            alert('Task updated successfully!');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
            modal.hide();
            
            // Reload page
            location.reload();
        } else {
            // Show errors
            errorList.innerHTML = '';
            if (data.errors && data.errors.length > 0) {
                data.errors.forEach(error => {
                    const li = document.createElement('li');
                    li.textContent = error;
                    errorList.appendChild(li);
                });
            } else {
                errorList.innerHTML = '<li>' + data.message + '</li>';
            }
            errorDiv.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Error:', error);
        errorList.innerHTML = '<li>An unexpected error occurred. Please try again.</li>';
        errorDiv.classList.remove('d-none');
    } finally {
        // Re-enable button
        editTaskBtn.disabled = false;
        editTaskBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    }
});
</script>
