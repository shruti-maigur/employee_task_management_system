// ============================================================
// Footer Component
// File: frontend/src/components/Footer.js
// ============================================================

import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-dark text-white text-center py-3 mt-5">
      <div className="container-fluid">
        <p className="mb-0">
          <small>
            &copy; {currentYear} Task Management System. All rights reserved.
          </small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
