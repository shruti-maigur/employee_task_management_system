// ============================================================
// Task Form Component
// File: frontend/src/components/TaskForm.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskAPI';
import '../styles/TaskForm.css';

const TaskForm = ({ onTaskCreated, editingTask = null, onTaskUpdated = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load task data if editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'Pending'
      });
      setShowForm(true);
    }
  }, [editingTask]);

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Task title cannot exceed 255 characters';
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!validStatuses.includes(formData.status)) {
      newErrors.status = 'Invalid status selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const response = editingTask
        ? await updateTask(editingTask.id, formData)
        : await createTask(formData);

      if (response.success) {
        const message = editingTask ? 'Task updated successfully!' : 'Task created successfully!';
        setSuccessMessage(message);

        // Reset form
        setFormData({
          title: '',
          description: '',
          status: 'Pending'
        });
        setShowForm(false);

        // Notify parent component
        if (editingTask && onTaskUpdated) {
          onTaskUpdated();
        } else if (onTaskCreated) {
          onTaskCreated();
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = error.response?.data?.message || 'Error processing task';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form cancel
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Pending'
    });
    setErrors({});
    setSuccessMessage('');
    setShowForm(false);
    if (onTaskUpdated) {
      onTaskUpdated(); // Reset editing state in parent
    }
  };

  return (
    <div className="task-form-container">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage('')}
          ></button>
        </div>
      )}

      {/* Toggle Button */}
      {!showForm && (
        <button
          className="btn btn-primary btn-lg mb-4"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus-circle"></i> {editingTask ? 'Edit Task' : 'Add New Task'}
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card task-form-card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className={`fas ${editingTask ? 'fa-edit' : 'fa-plus'}`}></i>
              {' '}
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Task Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  maxLength={255}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <div className="invalid-feedback d-block">{errors.title}</div>
                )}
              </div>

              {/* Description Field */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Status Field */}
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback d-block">{errors.status}</div>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="alert alert-danger mb-3">{errors.submit}</div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success flex-grow-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {editingTask ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      {' '}
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
