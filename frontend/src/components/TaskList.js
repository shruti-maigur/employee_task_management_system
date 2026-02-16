// ============================================================
// Task List Component
// File: frontend/src/components/TaskList.js
// ============================================================

import React, { useState } from 'react';
import { deleteTask } from '../services/taskAPI';
import '../styles/TaskList.css';

const TaskList = ({ tasks = [], onTaskDeleted, onTaskEdit }) => {
  const [deleting, setDeleting] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  /**
   * Get status badge color
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-warning text-dark';
      case 'In Progress':
        return 'badge-info';
      case 'Completed':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Handle delete task
   */
  const handleDeleteTask = async (taskId) => {
    setDeleting(taskId);
    try {
      const response = await deleteTask(taskId);
      
      if (response.success) {
        setDeleteConfirmId(null);
        if (onTaskDeleted) {
          onTaskDeleted();
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || 'Error deleting task';
      setErrorMessage(message);
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Handle edit task
   */
  const handleEditTask = (task) => {
    if (onTaskEdit) {
      onTaskEdit(task);
    }
  };

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state text-center">
        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
        <h5 className="text-muted">No Tasks Yet</h5>
        <p className="text-muted">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage('')}
          ></button>
        </div>
      )}

      {/* Tasks Count */}
      <div className="mb-3">
        <h6 className="text-muted">
          <i className="fas fa-list"></i> {tasks.length} Task{tasks.length !== 1 ? 's' : ''}
        </h6>
      </div>

      {/* Tasks Grid - Bootstrap Cards */}
      <div className="row">
        {tasks.map(task => (
          <div key={task.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card task-card h-100 shadow-sm hover-lift">
              {/* Card Header */}
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                  {task.status}
                </span>
                <small className="text-muted">
                  <i className="fas fa-calendar-alt"></i> {formatDate(task.created_at)}
                </small>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Title */}
                <h6 className="card-title text-truncate" title={task.title}>
                  {task.title}
                </h6>

                {/* Description */}
                {task.description && (
                  <p className="card-text text-muted small mb-2">
                    {task.description.substring(0, 100)}
                    {task.description.length > 100 ? '...' : ''}
                  </p>
                )}

                {/* Task ID */}
                <div className="text-muted very-small">
                  <span className="badge badge-light">ID: {task.id}</span>
                </div>
              </div>

              {/* Card Footer - Action Buttons */}
              <div className="card-footer bg-light d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary flex-grow-1"
                  onClick={() => handleEditTask(task)}
                  title="Edit this task"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>

                {deleteConfirmId === task.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-danger flex-grow-1"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={deleting === task.id}
                    >
                      {deleting === task.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check"></i> Confirm
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setDeleteConfirmId(null)}
                      disabled={deleting === task.id}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-danger flex-grow-1"
                    onClick={() => setDeleteConfirmId(task.id)}
                    title="Delete this task"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
