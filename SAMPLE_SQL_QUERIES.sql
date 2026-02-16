-- Task Management System - Sample SQL Queries
-- This file contains practical SQL examples for common task operations

-- ============================================================
-- 1. CREATE OPERATIONS
-- ============================================================

-- Insert a new task
INSERT INTO tasks 
(title, description, priority, status, assigned_to, created_by, due_date) 
VALUES 
('Implement User Authentication', 'Add JWT authentication to API', 'High', 'In Progress', 3, 1, '2026-03-01');

-- Insert multiple tasks at once
INSERT INTO tasks 
(title, description, priority, status, assigned_to, created_by, due_date) 
VALUES 
('Task 1', 'Description for task 1', 'High', 'Pending', 3, 1, '2026-02-28'),
('Task 2', 'Description for task 2', 'Medium', 'Pending', 4, 2, '2026-03-05'),
('Task 3', 'Description for task 3', 'Low', 'Completed', 3, 1, '2026-02-20');


-- ============================================================
-- 2. READ OPERATIONS
-- ============================================================

-- Get all tasks with employee names
SELECT 
  t.id,
  t.title,
  t.description,
  t.priority,
  t.status,
  t.due_date,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_employee,
  CONCAT(c.first_name, ' ', c.last_name) as created_by_name,
  t.created_at,
  t.updated_at
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN users c ON t.created_by = c.id
ORDER BY t.due_date ASC, t.priority DESC;

-- Get tasks by status
SELECT * FROM tasks 
WHERE status = 'Pending'
ORDER BY due_date ASC;

-- Get tasks with high priority
SELECT * FROM tasks 
WHERE priority = 'High'
AND status != 'Completed'
ORDER BY due_date ASC;

-- Get tasks assigned to specific employee
SELECT * FROM tasks 
WHERE assigned_to = 3
ORDER BY due_date ASC, priority DESC;

-- Get tasks created by specific user
SELECT * FROM tasks 
WHERE created_by = 1
ORDER BY created_at DESC;

-- Get single task by ID with full details
SELECT 
  t.*,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_employee,
  CONCAT(c.first_name, ' ', c.last_name) as created_by_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN users c ON t.created_by = c.id
WHERE t.id = 5;

-- Get unassigned tasks
SELECT * FROM tasks 
WHERE assigned_to IS NULL
ORDER BY due_date ASC;

-- Get tasks due in the next 7 days
SELECT * FROM tasks 
WHERE due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
AND status != 'Completed'
ORDER BY due_date ASC;

-- Get tasks by multiple statuses
SELECT * FROM tasks 
WHERE status IN ('Pending', 'In Progress')
ORDER BY priority DESC, due_date ASC;


-- ============================================================
-- 3. STATISTICS & AGGREGATION
-- ============================================================

-- Get task count by status
SELECT 
  status,
  COUNT(*) as count
FROM tasks
GROUP BY status;

-- Get task count by priority
SELECT 
  priority,
  COUNT(*) as count
FROM tasks
GROUP BY priority
ORDER BY FIELD(priority, 'High', 'Medium', 'Low');

-- Get tasks count per employee
SELECT 
  CONCAT(u.first_name, ' ', u.last_name) as employee_name,
  COUNT(t.id) as task_count
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
WHERE u.role IN ('Employee', 'Manager')
GROUP BY u.id, u.first_name, u.last_name
ORDER BY task_count DESC;

-- Get dashboard statistics
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
  SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
FROM tasks;

-- Get tasks completion rate
SELECT 
  CONCAT(
    ROUND(COUNT(CASE WHEN status = 'Completed' THEN 1 END) / COUNT(*) * 100, 2), 
    '%'
  ) as completion_rate
FROM tasks;

-- Get high priority pending tasks
SELECT 
  COUNT(*) as urgent_tasks
FROM tasks
WHERE priority = 'High'
AND status IN ('Pending', 'In Progress');

-- Get overdue tasks
SELECT * FROM tasks
WHERE due_date < CURDATE()
AND status != 'Completed'
ORDER BY due_date ASC;

-- Get tasks count by month
SELECT 
  DATE_TRUNC(created_at, MONTH) as month,
  COUNT(*) as tasks_created
FROM tasks
GROUP BY DATE_TRUNC(created_at, MONTH)
ORDER BY month DESC;


-- ============================================================
-- 4. UPDATE OPERATIONS
-- ============================================================

-- Update task status
UPDATE tasks 
SET status = 'In Progress', updated_at = CURRENT_TIMESTAMP
WHERE id = 5;

-- Update task priority
UPDATE tasks 
SET priority = 'High', updated_at = CURRENT_TIMESTAMP
WHERE id = 3;

-- Assign task to employee
UPDATE tasks 
SET assigned_to = 4, updated_at = CURRENT_TIMESTAMP
WHERE id = 7;

-- Reassign all pending tasks for one employee to another
UPDATE tasks 
SET assigned_to = 5, updated_at = CURRENT_TIMESTAMP
WHERE assigned_to = 3 AND status != 'Completed';

-- Update task with multiple fields
UPDATE tasks 
SET 
  title = 'Updated Task Title',
  description = 'Updated description',
  priority = 'Medium',
  status = 'In Progress',
  due_date = '2026-03-20',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 8;

-- Mark all overdue pending tasks as urgent (High priority)
UPDATE tasks 
SET priority = 'High', updated_at = CURRENT_TIMESTAMP
WHERE due_date < CURDATE()
AND status = 'Pending'
AND priority != 'High';

-- Complete all tasks for a specific project/category
UPDATE tasks 
SET status = 'Completed', updated_at = CURRENT_TIMESTAMP
WHERE created_by = 2
AND status != 'Completed'
LIMIT 5;


-- ============================================================
-- 5. DELETE OPERATIONS
-- ============================================================

-- Delete a single task by ID
DELETE FROM tasks 
WHERE id = 10;

-- Delete all completed tasks older than 30 days
DELETE FROM tasks 
WHERE status = 'Completed'
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Delete all tasks that were never assigned
DELETE FROM tasks 
WHERE assigned_to IS NULL
AND status = 'Pending'
AND created_at < DATE_SUB(NOW(), INTERVAL 60 DAY);

-- Delete tasks created by a user (use with caution!)
DELETE FROM tasks 
WHERE created_by = 5;


-- ============================================================
-- 6. FILTERING COMBINATIONS
-- ============================================================

-- Get pending tasks with upcoming deadlines for a specific employee
SELECT * FROM tasks
WHERE assigned_to = 3
AND status = 'Pending'
AND due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 14 DAY)
ORDER BY due_date ASC;

-- Get all in-progress or pending tasks sorted by priority
SELECT 
  t.*,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_employee
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE status IN ('Pending', 'In Progress')
ORDER BY 
  FIELD(priority, 'High', 'Medium', 'Low'),
  due_date ASC;

-- Get tasks assigned to managers with high priority
SELECT 
  t.*,
  CONCAT(u.first_name, ' ', u.last_name) as employee_name,
  u.role
FROM tasks t
JOIN users u ON t.assigned_to = u.id
WHERE u.role = 'Manager'
AND t.priority = 'High'
AND t.status != 'Completed';

-- Get recently updated tasks
SELECT * FROM tasks
ORDER BY updated_at DESC
LIMIT 10;

-- Get tasks with no deadline set
SELECT * FROM tasks
WHERE due_date IS NULL
ORDER BY created_at DESC;


-- ============================================================
-- 7. BACKUP & MAINTENANCE
-- ============================================================

-- Get database size statistics
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS table_size_mb
FROM information_schema.TABLES 
WHERE table_schema = 'employee_task_db'
ORDER BY table_size_mb DESC;

-- Create backup of tasks table
-- (Execute separately in backup tool)
-- mysqldump -u root -p employee_task_db tasks > tasks_backup.sql

-- Count records before deletion (for verification)
SELECT COUNT(*) as total_records FROM tasks;

-- Verify data integrity
SELECT COUNT(DISTINCT id) as unique_ids, COUNT(*) as total_rows 
FROM tasks;


-- ============================================================
-- 8. PRACTICAL USE CASES
-- ============================================================

-- 1. Manager View: All tasks they created and tasks assigned to their team
SELECT 
  t.*,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_to_name,
  CONCAT(c.first_name, ' ', c.last_name) as created_by_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN users c ON t.created_by = c.id
WHERE t.created_by = 2  -- Manager ID
ORDER BY t.created_at DESC;

-- 2. Employee View: Only their assigned tasks
SELECT 
  t.*,
  CONCAT(c.first_name, ' ', c.last_name) as created_by_name
FROM tasks t
LEFT JOIN users c ON t.created_by = c.id
WHERE t.assigned_to = 3  -- Employee ID
ORDER BY t.due_date ASC;

-- 3. Weekly Report: Tasks completed this week
SELECT 
  DATE(created_at) as created_date,
  COUNT(*) as tasks_created,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as tasks_completed
FROM tasks
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
GROUP BY DATE(created_at)
ORDER BY created_date DESC;

-- 4. Find bottlenecks: Employees with most pending tasks
SELECT 
  CONCAT(u.first_name, ' ', u.last_name) as employee_name,
  COUNT(*) as pending_tasks,
  MAX(t.due_date) as latest_due_date
FROM tasks t
JOIN users u ON t.assigned_to = u.id
WHERE t.status = 'Pending'
GROUP BY t.assigned_to, u.first_name, u.last_name
ORDER BY pending_tasks DESC;

-- 5. Task distribution: How many tasks per priority level
SELECT 
  priority,
  status,
  COUNT(*) as count
FROM tasks
GROUP BY priority, status
ORDER BY 
  FIELD(priority, 'High', 'Medium', 'Low'),
  FIELD(status, 'Pending', 'In Progress', 'Completed');

-- 6. Find unstarted high-priority tasks
SELECT * FROM tasks
WHERE priority = 'High'
AND status = 'Pending'
AND due_date IS NOT NULL
ORDER BY due_date ASC;

-- 7. Get task details for reporting
SELECT 
  t.id,
  t.title,
  t.priority,
  t.status,
  t.due_date,
  DATEDIFF(t.due_date, CURDATE()) as days_until_due,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_to,
  CONCAT(c.first_name, ' ', c.last_name) as created_by
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
LEFT JOIN users c ON t.created_by = c.id
ORDER BY t.due_date ASC;

-- 8. Find tasks ready for assignment
SELECT * FROM tasks
WHERE assigned_to IS NULL
AND status = 'Pending'
ORDER BY priority DESC;
