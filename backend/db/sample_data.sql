-- Sample Data Insert Script for Employee Task Management System
-- Run this after creating the database schema

-- NOTE: passwords below are bcrypt hashes of 'Password123!'

-- Insert Admin, Manager and Employees
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', 'Admin'),
('Manager One', 'manager@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', 'Manager'),
('John Doe', 'john@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', 'Employee'),
('Jane Smith', 'jane@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', 'Employee');

-- Insert Sample Tasks (using due_date and capitalized enums)
INSERT INTO tasks (title, description, priority, status, assigned_to, created_by, due_date) VALUES
('Design Homepage', 'Create responsive homepage design with modern UI', 'High', 'In Progress', 3, 2, '2026-03-01'),
('Develop API Endpoints', 'Build RESTful API endpoints for task management', 'High', 'In Progress', 3, 2, '2026-02-28'),
('Create Marketing Campaign', 'Plan and execute Q1 marketing campaign', 'Medium', 'Pending', 4, 2, '2026-03-15'),
('Database Optimization', 'Optimize queries and add indexes', 'Medium', 'Completed', 3, 2, '2026-02-10');

-- Insert Sample Task Comments
INSERT INTO task_comments (task_id, user_id, comment) VALUES
(1, 2, 'Great progress on the design, keep up the good work!'),
(1, 3, 'Will incorporate feedback and update by tomorrow'),
(2, 2, 'API implementation looks solid');

-- Quick counts
SELECT 'Users' as 'Data Type', COUNT(*) as Count FROM users
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Comments', COUNT(*) FROM task_comments;
