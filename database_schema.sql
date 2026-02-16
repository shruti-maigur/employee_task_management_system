-- Employee Task Management System - MySQL Database Schema

-- Create Database
CREATE DATABASE IF NOT EXISTS employee_task_db;
USE employee_task_db;

-- Users Table (for employee management)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Manager', 'Employee') DEFAULT 'Employee',
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  assigned_to INT,
  created_by INT NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_due_date (due_date),
  INDEX idx_created_by (created_by)
);

-- Sample Data (Optional - for testing)
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('John', 'Admin', 'admin@company.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P48nsS', 'Admin'),
('Jane', 'Manager', 'manager@company.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P48nsS', 'Manager'),
('Bob', 'Employee', 'employee1@company.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P48nsS', 'Employee'),
('Alice', 'Employee', 'employee2@company.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P48nsS', 'Employee');

-- Sample Tasks (Optional)
INSERT INTO tasks (title, description, priority, status, assigned_to, created_by, due_date) VALUES
('Complete Project Documentation', 'Write comprehensive documentation for the project', 'High', 'Pending', 3, 2, '2026-03-01'),
('Fix Login Bug', 'Debug and fix the login page issue', 'High', 'In Progress', 4, 2, '2026-02-28'),
('Design Dashboard UI', 'Create mockups for the new dashboard', 'Medium', 'Pending', 3, 1, '2026-03-15'),
('Database Optimization', 'Optimize queries for better performance', 'Low', 'Completed', 4, 1, '2026-02-10');
