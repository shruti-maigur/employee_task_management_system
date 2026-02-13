-- Sample Data Insert Script for Employee Task Management System
-- Run this after creating the database schema

-- Insert Admin User
INSERT INTO users (first_name, last_name, email, password, phone, role, department, is_active) 
VALUES ('Admin', 'User', 'admin@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '1234567890', 'admin', 'Administration', TRUE);

-- Insert Employee Users
INSERT INTO users (first_name, last_name, email, password, phone, role, department, is_active) VALUES
('John', 'Doe', 'john@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '9876543210', 'employee', 'Development', TRUE),
('Jane', 'Smith', 'jane@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '5555555555', 'employee', 'Marketing', TRUE),
('Bob', 'Johnson', 'bob@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '7777777777', 'employee', 'Sales', TRUE),
('Alice', 'Williams', 'alice@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '4444444444', 'employee', 'Development', TRUE),
('Charlie', 'Brown', 'charlie@company.com', '$2a$10$YIjlrHzP3.5V2bXq.7r7zObOHzR6R7i4Q7nZ5K4c5X8q.k8qLJ0gK', '9999999999', 'employee', 'HR', TRUE);

-- Insert Sample Tasks
INSERT INTO tasks (title, description, priority, status, assigned_to, created_by, deadline, progress) VALUES
('Design Homepage', 'Create responsive homepage design with modern UI', 'high', 'in_progress', 2, 1, '2026-03-01', 50),
('Develop API Endpoints', 'Build RESTful API endpoints for task management', 'urgent', 'in_progress', 2, 1, '2026-02-28', 75),
('Create Marketing Campaign', 'Plan and execute Q1 marketing campaign', 'medium', 'pending', 3, 1, '2026-03-15', 0),
('Sales Proposal', 'Prepare proposal for new enterprise client', 'high', 'pending', 4, 1, '2026-02-20', 0),
('Database Optimization', 'Optimize queries and add indexes', 'medium', 'completed', 2, 1, '2026-02-10', 100),
('User Documentation', 'Write comprehensive user guide', 'low', 'in_progress', 5, 1, '2026-03-20', 40),
('System Testing', 'Perform QA testing on all modules', 'high', 'pending', 4, 1, '2026-03-05', 0),
('Deploy to Production', 'Deploy application to production server', 'urgent', 'pending', 2, 1, '2026-03-10', 0),
('Client Meeting Prep', 'Prepare slides and documents for client meeting', 'medium', 'in_progress', 3, 1, '2026-02-18', 60),
('Bug Fixes', 'Fix reported bugs from beta testing', 'high', 'in_progress', 2, 1, '2026-02-25', 30);

-- Insert Sample Task Comments
INSERT INTO task_comments (task_id, user_id, comment) VALUES
(1, 1, 'Great progress on the design, keep up the good work!'),
(1, 2, 'Will incorporate feedback and update by tomorrow'),
(2, 1, 'API implementation looks solid'),
(3, 3, 'Starting research on campaign strategies'),
(4, 4, 'Gathered requirements, will start drafting proposal'),
(5, 2, 'Optimization complete, improved query time by 40%'),
(6, 5, 'Draft documentation completed, pending review'),
(7, 4, 'Ready to begin testing phase'),
(8, 2, 'Code is production ready'),
(9, 3, 'Slides are ready, reviewing with team'),
(10, 2, 'Fixed 5 critical bugs, still working on minor issues');

-- Verify the data was inserted
SELECT 'Users' as 'Data Type', COUNT(*) as Count FROM users
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'Comments', COUNT(*) FROM task_comments;

-- Display all users
SELECT id, CONCAT(first_name, ' ', last_name) as Name, email, role, department, is_active 
FROM users 
ORDER BY role DESC;

-- Display all tasks with assigned user names
SELECT t.id, t.title, t.priority, t.status, CONCAT(u.first_name, ' ', u.last_name) as Assigned_To, t.deadline, t.progress
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
ORDER BY t.deadline ASC;
