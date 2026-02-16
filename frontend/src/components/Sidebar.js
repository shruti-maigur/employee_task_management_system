import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {user?.role === 'admin' ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tasks" className="nav-link">All Tasks</Link>
            <Link to="/employees" className="nav-link">Employees</Link>
            <Link to="/reports" className="nav-link">Reports</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/my-tasks" className="nav-link">My Tasks</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
