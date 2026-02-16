import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tasks/dashboard-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="dashboard-layout">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Dashboard</h2>
          {loading ? (
            <p>Loading...</p>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Tasks</h3>
                <p className="stat-number">{stats.total_tasks || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Tasks</h3>
                <p className="stat-number pending">{stats.pending_tasks || 0}</p>
              </div>
              <div className="stat-card">
                <h3>In Progress</h3>
                <p className="stat-number in-progress">{stats.in_progress_tasks || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Completed Tasks</h3>
                <p className="stat-number completed">{stats.completed_tasks || 0}</p>
              </div>
              {user?.role === 'admin' && (
                <div className="stat-card">
                  <h3>Total Employees</h3>
                  <p className="stat-number">{stats.total_employees || 0}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Failed to load statistics</p>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
