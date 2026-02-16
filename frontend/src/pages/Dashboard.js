import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import '../styles/Dashboard.css';
import '../styles/TaskManagement.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const taskListRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { default: api } = await import('../services/api');
        const { data } = await api.get('/tasks/dashboard-stats');
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleTaskCreated = () => {
    // Reload stats and task list
    window.location.reload();
  };

  const handleTaskUpdated = () => {
    // Reload stats and task list
    window.location.reload();
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="container-fluid">
            <div className="dashboard-header mb-4">
              <h1><i className="fas fa-tasks"></i> Task Management Dashboard</h1>
              <p>Manage and track all your tasks efficiently</p>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                {stats && (
                  <div className="row mb-4 g-3">
                    <div className="col-md-3">
                      <div className="stat-card">
                        <h3>{stats.total_tasks || 0}</h3>
                        <p><i className="fas fa-list-check"></i> Total Tasks</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card pending">
                        <h3>{stats.pending_tasks || 0}</h3>
                        <p><i className="fas fa-clock"></i> Pending</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card in-progress">
                        <h3>{stats.in_progress_tasks || 0}</h3>
                        <p><i className="fas fa-spinner"></i> In Progress</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card completed">
                        <h3>{stats.completed_tasks || 0}</h3>
                        <p><i className="fas fa-check-circle"></i> Completed</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Create Task Button */}
                <div className="mb-4">
                  <button 
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#createTaskModal"
                  >
                    <i className="fas fa-plus-circle"></i> Create New Task
                  </button>
                </div>

                {/* Task List */}
                <TaskList onEditTask={handleEditTask} />
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Modals */}
      <CreateTaskModal onTaskCreated={handleTaskCreated} />
      <EditTaskModal taskId={editingTaskId} onTaskUpdated={handleTaskUpdated} />
    </div>
  );
};

export default Dashboard;
