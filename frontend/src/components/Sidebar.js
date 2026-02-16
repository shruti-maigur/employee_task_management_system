import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {user?.role === 'Admin' ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tasks" className="nav-link">All Tasks</Link>
            <Link to="/users" className="nav-link">User Management</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </>
        ) : user?.role === 'Manager' ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/tasks" className="nav-link">Team Tasks</Link>
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
