// ============================================================
// Main App Component
// File: frontend/src/App.js
// ============================================================

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getAllTasks } from './services/taskAPI';
import './styles/Global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Fetch all tasks from API
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTasks();
      
      if (response && response.success) {
        setTasks(response.data || []);
      } else {
        console.error('Failed to fetch tasks:', response);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initial load - fetch all tasks
   */
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Handle task created
   */
  const handleTaskCreated = () => {
    setSuccessMessage('Task created successfully!');
    fetchTasks();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Handle task updated
   */
  const handleTaskUpdated = () => {
    setSuccessMessage('Task updated successfully!');
    setEditingTask(null);
    fetchTasks();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Handle task deleted
   */
  const handleTaskDeleted = () => {
    setSuccessMessage('Task deleted successfully!');
    fetchTasks();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /**
   * Handle edit task
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container-fluid">
          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage('')}
              ></button>
            </div>
          )}

          <div className="row">
            {/* Task Form Section - 1/3 width */}
            <div className="col-lg-4 mb-4">
              <div className="sticky-form">
                <TaskForm
                  onTaskCreated={handleTaskCreated}
                  onTaskUpdated={handleTaskUpdated}
                  editingTask={editingTask}
                />
              </div>
            </div>

            {/* Task List Section - 2/3 width */}
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading tasks...</p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onTaskDeleted={handleTaskDeleted}
                  onTaskEdit={handleEditTask}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="Admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Employees />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
