import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CreateTaskModal = ({ onTaskCreated }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: '',
    due_date: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  React.useEffect(() => {
    // Fetch employees for dropdown
    fetchEmployees();
  }, []);

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
        due_date: formData.due_date || null,
        created_by: user.id
      };

      const response = await axios.post('/api/tasks', payload);

      if (response.status === 201) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          status: 'Pending',
          assigned_to: '',
          due_date: ''
        });

        // Close modal
        const modal = document.getElementById('createTaskModal');
        if (modal) {
          const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }

        // Notify parent component
        if (onTaskCreated) {
          onTaskCreated();
        }

        alert('Task created successfully!');
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        setErrors(errorData.errors);
      } else {
        setErrors([errorData?.message || 'Error creating task']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade" id="createTaskModal" tabIndex="-1" aria-labelledby="createTaskModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="createTaskModalLabel">
              <i className="fas fa-plus-circle"></i> Create New Task
            </h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="taskTitle" className="form-label">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="taskTitle"
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
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="taskDescription"
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
                    <label htmlFor="taskPriority" className="form-label">
                      Priority <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="taskPriority"
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
                    <label htmlFor="taskStatus" className="form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="taskStatus"
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
                    <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="taskDueDate"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                    />
                    <small className="text-muted">Leave empty if no due date</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="taskAssignedTo" className="form-label">Assign to Employee</label>
                    <select
                      className="form-select"
                      id="taskAssignedTo"
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
                    <small className="text-muted">Optional - leave blank if not assigning</small>
                  </div>
                </div>
              </div>

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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Create Task
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

export default CreateTaskModal;
