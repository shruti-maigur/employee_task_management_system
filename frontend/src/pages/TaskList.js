import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/TaskList.css';

const TaskList = () => {
  const { user, token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    assigned_to: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchEmployees();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const { default: api } = await import('../services/api');
      const url = user?.role === 'Admin' || user?.role === 'Manager' ? '/tasks' : '/tasks/my-tasks';
      const { data } = await api.get(url);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { default: api } = await import('../services/api');
      const { data } = await api.get('/users');
      setEmployees(data.users || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { default: api } = await import('../services/api');
      const payload = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        deadline: newTask.deadline || null,
        assigned_to: newTask.assigned_to || null
      };
      const { data } = await api.post('/tasks', payload);
      setNewTask({ title: '', description: '', priority: 'Medium', deadline: '', assigned_to: '' });
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const { default: api } = await import('../services/api');
      const { data } = await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const { default: api } = await import('../services/api');
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="task-header">
            <h2>Tasks</h2>
            {(user?.role === 'Admin' || user?.role === 'Manager') && (
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Create New Task'}
              </button>
            )}
          </div>

          {showForm && (user?.role === 'Admin' || user?.role === 'Manager') && (
            <form onSubmit={handleCreateTask} className="task-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority:</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Assign to:</label>
                <select
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary">Create Task</button>
            </form>
          )}

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            <div className="tasks-table-container">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    {(user?.role === 'Admin' || user?.role === 'Manager') && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td><span className={`priority ${task.priority?.toLowerCase()}`}>{task.priority}</span></td>
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>{task.deadline || '-'}</td>
                      {(user?.role === 'Admin' || user?.role === 'Manager') && (
                        <td>
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TaskList;
