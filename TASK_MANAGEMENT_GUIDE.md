# Task Management System - Complete Implementation Guide

## Overview
This is a complete Employee Task Management System built with **React.js**, **Node.js/Express**, **MySQL**, and **Bootstrap 5**.

## Features Implemented

### 1. **Create New Task**
- Task Title (Required, max 255 characters)
- Description (Optional)
- Due Date (Date picker, optional)
- Priority (High / Medium / Low dropdown)
- Status (Pending / In Progress / Completed)
- Assigned Employee (Optional dropdown)
- Automatic timestamp and creator tracking

**File**: `frontend/src/components/CreateTaskModal.js`

### 2. **Edit Task**
- Fetch task data by ID
- Update all task details
- View creator information and creation date
- Save changes to database

**File**: `frontend/src/components/EditTaskModal.js`

### 3. **Delete Task**
- Delete task with confirmation dialog
- Only creator or Admin can delete
- Instant removal from database

**Integrated in**: `EditTaskModal.js`

### 4. **Task List & Dashboard**
- Display all tasks in a responsive table
- Show task statistics (Total, Pending, In Progress, Completed)
- Filter by Status
- Filter by Priority
- Sort by due date
- Inline edit/delete actions

**File**: `frontend/src/components/TaskList.js`

### 5. **Role-Based Access Control**
- Admin: Can view all tasks, create, edit, delete any task
- Manager: Can create tasks, edit own tasks
- Employee: Can view assigned tasks, update status

**Backend**: `backend/controllers/taskController.js`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Tasks Table
```sql
CREATE TABLE tasks (
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
```

## API Endpoints

### Task Operations

#### Get All Tasks
```
GET /api/tasks
Query Parameters:
  - status: 'Pending' | 'In Progress' | 'Completed'
  - priority: 'Low' | 'Medium' | 'High'
  - assigned_to: User ID

Response:
{
  "success": true,
  "tasks": [...]
}
```

#### Get Single Task
```
GET /api/tasks/:id

Response:
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "priority": "High",
    "status": "Pending",
    "assigned_to": 3,
    "assigned_employee": "John Doe",
    "created_by": 1,
    "created_by_name": "Jane Smith",
    "due_date": "2026-03-15",
    "created_at": "2026-02-16T10:30:00Z",
    "updated_at": "2026-02-16T10:30:00Z"
  }
}
```

#### Create Task
```
POST /api/tasks
Headers: Authorization: Bearer <JWT_TOKEN>

Body:
{
  "title": "New Task",
  "description": "Task description",
  "priority": "Medium",
  "status": "Pending",
  "assigned_to": 3,  // Optional
  "due_date": "2026-03-15"  // Optional (YYYY-MM-DD)
}

Response:
{
  "success": true,
  "message": "Task created successfully",
  "taskId": 15
}
```

#### Update Task
```
PUT /api/tasks/:id
Headers: Authorization: Bearer <JWT_TOKEN>

Body:
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "High",
  "status": "In Progress",
  "assigned_to": 4,
  "due_date": "2026-03-20"
}

Response:
{
  "success": true,
  "message": "Task updated successfully"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
Headers: Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Get Dashboard Stats
```
GET /api/tasks/dashboard-stats
Headers: Authorization: Bearer <JWT_TOKEN>

Response:
{
  "stats": {
    "total_tasks": 25,
    "pending_tasks": 8,
    "in_progress_tasks": 12,
    "completed_tasks": 5,
    "total_employees": 10  // Only if user is Admin
  }
}
```

## File Structure

```
employee_task_management_system/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── CreateTaskModal.js     # Task creation form
│       │   ├── EditTaskModal.js       # Task editing and deletion
│       │   ├── TaskList.js            # Task list with filters
│       │   ├── Header.js
│       │   ├── Sidebar.js
│       │   └── Footer.js
│       ├── pages/
│       │   └── Dashboard.js           # Main dashboard page
│       ├── styles/
│       │   ├── Dashboard.css
│       │   ├── TaskManagement.css     # Task UI styles
│       │   └── Global.css
│       └── services/
│           └── api.js                 # Axios API client
│
├── backend/
│   ├── controllers/
│   │   └── taskController.js          # Task business logic
│   ├── models/
│   │   └── taskModel.js               # Task database queries
│   ├── routes/
│   │   └── taskRoutes.js              # Task API routes
│   ├── middleware/
│   │   └── auth.js                    # JWT authentication
│   ├── config/
│   │   ├── database.js                # MySQL connection
│   │   └── constants.js               # App constants
│   └── server.js                      # Express server
│
└── database_schema.sql                # Database structure
```

## Usage Instructions

### 1. Setup Database
```bash
# Import database schema
mysql -u root -p employee_task_db < database_schema.sql
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Start Servers

**Backend (Terminal 1):**
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
# Runs on http://localhost:3000
```

### 4. Create Tasks
1. Click "Create New Task" button
2. Fill in task details
3. Click "Create Task" to save

### 5. Edit Tasks
1. Click "Edit" button on any task
2. Modify task details
3. Click "Save Changes" or "Delete" to perform action

### 6. Filter Tasks
1. Use Status dropdown to filter by status
2. Use Priority dropdown to filter by priority
3. Click "Reset Filters" to clear all filters

## Validation & Security

### SQL Injection Prevention
- ✅ All database queries use prepared statements
- ✅ Parameters are bound before execution
- ✅ No string concatenation in SQL queries

### Input Validation
- ✅ Required fields validation
- ✅ Character length limits
- ✅ Date format validation
- ✅ Enum value validation for priority/status

### Authentication
- ✅ JWT token-based authentication
- ✅ Bearer token verification
- ✅ Role-based access control

### Authorization
- ✅ Only assigned users can see their tasks
- ✅ Only creators/admins can delete tasks
- ✅ Status updates allowed by assigned users

## Sample Data

### Users (pre-inserted)
```sql
-- Admin User
INSERT INTO users VALUES (1, 'John', 'Admin', 'admin@company.com', 'hashed_password', 'Admin', 'Active', NOW(), NOW());

-- Manager User
INSERT INTO users VALUES (2, 'Jane', 'Manager', 'manager@company.com', 'hashed_password', 'Manager', 'Active', NOW(), NOW());

-- Employee Users
INSERT INTO users VALUES (3, 'Bob', 'Employee', 'employee1@company.com', 'hashed_password', 'Employee', 'Active', NOW(), NOW());
INSERT INTO users VALUES (4, 'Alice', 'Employee', 'employee2@company.com', 'hashed_password', 'Employee', 'Active', NOW(), NOW());
```

### Sample Tasks
```sql
INSERT INTO tasks 
(title, description, priority, status, assigned_to, created_by, due_date) 
VALUES 
('Complete Project Documentation', 'Write comprehensive documentation', 'High', 'Pending', 3, 2, '2026-03-01'),
('Fix Login Bug', 'Debug login page issue', 'High', 'In Progress', 4, 2, '2026-02-28'),
('Design Dashboard UI', 'Create mockups for dashboard', 'Medium', 'Pending', 3, 1, '2026-03-15'),
('Database Optimization', 'Optimize queries', 'Low', 'Completed', 4, 1, '2026-02-10');
```

## Styles & Design

### Color Scheme
- **Primary**: #3498db (Blue)
- **Danger**: #e74c3c (Red)
- **Success**: #27ae60 (Green)
- **Warning**: #f39c12 (Orange)

### Bootstrap Components Used
- ✅ Modals
- ✅ Tables
- ✅ Forms
- ✅ Badges
- ✅ Cards
- ✅ Responsive Grid
- ✅ Buttons

### Responsive Design
- ✅ Mobile-friendly layout
- ✅ Tablet optimized
- ✅ Desktop fully featured
- ✅ Flexbox & CSS Grid

## Error Handling

### Success Responses
```json
{
  "success": true,
  "message": "Task created successfully",
  "taskId": 15
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Specific error 1", "Specific error 2"]
}
```

### HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Performance Features

- ✅ Indexed database columns for faster queries
- ✅ Lazy loading of task lists
- ✅ Efficient filtering on frontend
- ✅ Minimal API calls
- ✅ Caching where applicable

## Future Enhancements

1. Task comments and collaboration
2. Task attachments
3. Recurring tasks
4. Task templates
5. Email notifications
6. Task activity logs
7. Advanced filtering and search
8. Task analytics and reports
9. Kanban board view
10. Calendar view

## Troubleshooting

### Tasks not loading
- Check JWT token validity
- Verify database connection
- Check browser console for errors
- Ensure API server is running

### Edit modal not showing
- Clear browser cache
- Check Bootstrap version compatibility
- Verify task ID is correct

### Delete not working
- Verify user permission
- Check user role
- Ensure JWT token is valid

## Support
For issues or questions, check the database schema and API endpoint documentation above.
