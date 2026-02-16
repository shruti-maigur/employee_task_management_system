import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EditTaskModal = ({ taskId, onTaskUpdated }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: '',
    due_date: ''
  });
  const [taskInfo, setTaskInfo] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (taskId) {
      fetchTaskData();
      fetchEmployees();
    }
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get(`/api/tasks/${taskId}`);
      const task = response.data.task;
      
      setTaskInfo(task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || ''
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      setErrors(['Failed to load task data']);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/users');
      setEmployees(response.data.users || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
        due_date: formData.due_date || null
      };

      const response = await axios.put(`/api/tasks/${taskId}`, payload);

      if (response.status === 200) {
        // Close modal
        const modal = document.getElementById('editTaskModal');
        if (modal) {
          const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }

        // Notify parent component
        if (onTaskUpdated) {
          onTaskUpdated();
        }

        alert('Task updated successfully!');
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        setErrors(errorData.errors);
      } else {
        setErrors([errorData?.message || 'Error updating task']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/api/tasks/${taskId}`);

      if (response.status === 200) {
        // Close modal
        const modal = document.getElementById('editTaskModal');
        if (modal) {
          const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }

        // Notify parent component
        if (onTaskUpdated) {
          onTaskUpdated();
        }

        alert('Task deleted successfully!');
      }
    } catch (error) {
      const errorData = error.response?.data;
      setErrors([errorData?.message || 'Error deleting task']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="editTaskModal" tabIndex="-1" aria-labelledby="editTaskModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title" id="editTaskModalLabel">
              <i className="fas fa-edit"></i> Edit Task
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="editTaskTitle" className="form-label">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editTaskTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  required
                  maxLength="255"
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="editTaskDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="editTaskDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter task description (optional)"
                />
              </div>

              {/* Priority and Status Row */}
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="editTaskPriority" className="form-label">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="editTaskPriority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="editTaskStatus" className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="editTaskStatus"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Due Date and Assigned To Row */}
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="editTaskDueDate" className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="editTaskDueDate"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                    />
                    <small className="text-muted">Leave empty if no due date</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="editTaskAssignedTo" className="form-label">Assign to Employee</label>
                    <select
                      className="form-select"
                      id="editTaskAssignedTo"
                      name="assigned_to"
                      value={formData.assigned_to}
                      onChange={handleChange}
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Task Info */}
              {taskInfo && (
                <div className="alert alert-info" role="alert">
                  <small>
                    Created by: <strong>{taskInfo.created_by_name || 'Unknown'}</strong> |
                    Created: <strong>{new Date(taskInfo.created_at).toLocaleDateString()}</strong>
                  </small>
                </div>
              )}

              {/* Error Messages */}
              {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
                style={{ marginRight: 'auto' }}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
              <button type="submit" className="btn btn-warning" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
