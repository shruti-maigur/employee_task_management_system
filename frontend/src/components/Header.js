// ============================================================
// Header Component
// File: frontend/src/components/Header.js
// ============================================================

import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header bg-dark text-white py-3">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="logo">
            <h1 className="mb-0">
              <i className="fas fa-tasks me-2"></i>Task Manager
            </h1>
          </div>
          <div className="header-right">
            <p className="text-muted mb-0">
              <small>Version 1.0</small>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
