<?php
/**
 * Create Task Page/Modal
 * Shows form to add new task
 */

require_once __DIR__ . '/../models/Task.php';

$task = new Task();
$employees = $task->getEmployees();
?>

<!-- Create Task Modal -->
<div class="modal fade" id="createTaskModal" tabindex="-1" aria-labelledby="createTaskModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="createTaskModalLabel">
                    <i class="fas fa-plus-circle"></i> Create New Task
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="createTaskForm" method="POST" action="../handlers/create_task.php">
                <div class="modal-body">
                    <!-- Title -->
                    <div class="mb-3">
                        <label for="taskTitle" class="form-label">Task Title <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="taskTitle" name="title" placeholder="Enter task title" required maxlength="255">
                        <div class="invalid-feedback" id="titleError"></div>
                    </div>

                    <!-- Description -->
                    <div class="mb-3">
                        <label for="taskDescription" class="form-label">Description</label>
                        <textarea class="form-control" id="taskDescription" name="description" rows="4" placeholder="Enter task description (optional)"></textarea>
                    </div>

                    <!-- Priority and Status Row -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="taskPriority" class="form-label">Priority <span class="text-danger">*</span></label>
                                <select class="form-select" id="taskPriority" name="priority" required>
                                    <option value="Low">Low</option>
                                    <option value="Medium" selected>Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="taskStatus" class="form-label">Status <span class="text-danger">*</span></label>
                                <select class="form-select" id="taskStatus" name="status" required>
                                    <option value="Pending" selected>Pending</option>
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
                                <label for="taskDueDate" class="form-label">Due Date</label>
                                <input type="date" class="form-control" id="taskDueDate" name="due_date">
                                <small class="text-muted">Leave empty if no due date</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="taskAssignedTo" class="form-label">Assign to Employee</label>
                                <select class="form-select" id="taskAssignedTo" name="assigned_to">
                                    <option value="">-- Select Employee --</option>
                                    <?php foreach ($employees as $emp): ?>
                                        <option value="<?php echo $emp['id']; ?>">
                                            <?php echo htmlspecialchars($emp['full_name']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                                <small class="text-muted">Optional - leave blank if not assigning</small>
                            </div>
                        </div>
                    </div>

                    <!-- Error Messages -->
                    <div id="createTaskErrors" class="alert alert-danger d-none" role="alert">
                        <ul id="errorList" class="mb-0"></ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="createTaskBtn">
                        <i class="fas fa-save"></i> Create Task
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Create Task Form Handler
document.getElementById('createTaskForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const createTaskBtn = document.getElementById('createTaskBtn');
    const errorDiv = document.getElementById('createTaskErrors');
    const errorList = document.getElementById('errorList');

    // Disable button during submission
    createTaskBtn.disabled = true;
    createTaskBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating...';

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            alert('Task created successfully!');
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('createTaskModal'));
            modal.hide();
            this.reset();
            
            // Reload page or update dashboard
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
        createTaskBtn.disabled = false;
        createTaskBtn.innerHTML = '<i class="fas fa-save"></i> Create Task';
    }
});
</script>
