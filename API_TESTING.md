# API Testing Guide

This guide shows how to test all API endpoints using curl or Postman.

## Base URL
```
http://localhost:5000
```

## Authentication Headers
All protected endpoints require this header:
```
Authorization: Bearer <JWT_TOKEN>
```

## 1. Authentication Endpoints

### 1.1 Register User
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "1234567890",
    "department": "Engineering"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 6
}
```

### 1.2 Login
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

### 1.3 Get User Profile
**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "Admin",
    "last_name": "User",
    "email": "admin@company.com",
    "phone": "1234567890",
    "role": "admin",
    "department": "Administration",
    "profile_image": null,
    "created_at": "2026-02-13T10:00:00.000Z"
  }
}
```

### 1.4 Update User Profile
**Request:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Admin",
    "last_name": "User",
    "phone": "9999999999",
    "department": "Administration"
  }'
```

**Response:**
```json
{
  "message": "Profile updated successfully"
}
```

### 1.5 Forgot Password
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com"
  }'
```

**Response:**
```json
{
  "message": "Password reset token sent to email",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.6 Reset Password
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN_FROM_PREVIOUS_REQUEST",
    "newPassword": "newpassword123"
  }'
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

## 2. Task Endpoints

### 2.1 Get Dashboard Statistics
**Request:**
```bash
curl -X GET http://localhost:5000/api/tasks/dashboard-stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "stats": {
    "total_tasks": 10,
    "pending_tasks": 3,
    "in_progress_tasks": 5,
    "completed_tasks": 2,
    "total_employees": 5
  }
}
```

### 2.2 Get All Tasks (Admin Only)
**Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks/?status=pending&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
- `status` - pending, in_progress, completed, cancelled
- `priority` - low, medium, high, urgent
- `assignedTo` - user ID
- `createdBy` - user ID

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design Homepage",
      "description": "Create responsive homepage",
      "priority": "high",
      "status": "in_progress",
      "assigned_to": 2,
      "created_by": 1,
      "deadline": "2026-03-01",
      "completed_at": null,
      "progress": 50,
      "created_at": "2026-02-13T10:00:00.000Z",
      "updated_at": "2026-02-13T10:00:00.000Z"
    }
  ]
}
```

### 2.3 Get User's Assigned Tasks
**Request:**
```bash
curl -X GET "http://localhost:5000/api/tasks/my-tasks?status=in_progress" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Design Homepage",
      "description": "Create responsive homepage",
      "priority": "high",
      "status": "in_progress",
      "assigned_to": 2,
      "deadline": "2026-03-01",
      "progress": 50
    }
  ]
}
```

### 2.4 Get Task by ID
**Request:**
```bash
curl -X GET http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "task": {
    "id": 1,
    "title": "Design Homepage",
    "description": "Create responsive homepage",
    "priority": "high",
    "status": "in_progress",
    "assigned_to": 2,
    "first_name": "John",
    "last_name": "Doe",
    "deadline": "2026-03-01",
    "progress": 50,
    "comments": [
      {
        "id": 1,
        "task_id": 1,
        "user_id": 1,
        "comment": "Great progress!",
        "first_name": "Admin",
        "last_name": "User",
        "created_at": "2026-02-13T10:00:00.000Z"
      }
    ]
  }
}
```

### 2.5 Create Task (Admin Only)
**Request:**
```bash
curl -X POST http://localhost:5000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Development",
    "description": "Develop user authentication module",
    "priority": "high",
    "deadline": "2026-03-10",
    "assigned_to": 2
  }'
```

**Response:**
```json
{
  "message": "Task created successfully",
  "taskId": 11
}
```

### 2.6 Update Task
**Request:**
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "progress": 100,
    "title": "Design Homepage - Updated"
  }'
```

**Response:**
```json
{
  "message": "Task updated successfully"
}
```

**Fields that can be updated:**
- `title`
- `description`
- `priority` (low, medium, high, urgent)
- `status` (pending, in_progress, completed, cancelled)
- `deadline`
- `assigned_to`
- `progress` (0-100)

### 2.7 Delete Task (Admin Only)
**Request:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

### 2.8 Add Comment to Task
**Request:**
```bash
curl -X POST http://localhost:5000/api/tasks/1/comments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "Great progress on this task!"
  }'
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "commentId": 5
}
```

## 3. Employee Endpoints

### 3.1 Get All Employees (Admin Only)
**Request:**
```bash
curl -X GET http://localhost:5000/api/employees/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "employees": [
    {
      "id": 2,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@company.com",
      "phone": "9876543210",
      "department": "Development",
      "role": "employee",
      "is_active": true
    }
  ]
}
```

### 3.2 Get Employee Details (Admin Only)
**Request:**
```bash
curl -X GET http://localhost:5000/api/employees/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "employee": {
    "id": 2,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "phone": "9876543210",
    "department": "Development",
    "role": "employee",
    "is_active": true
  },
  "tasks": [
    {
      "id": 1,
      "title": "Design Homepage",
      "status": "in_progress",
      "priority": "high",
      "deadline": "2026-03-01"
    }
  ]
}
```

### 3.3 Update Employee (Admin Only)
**Request:**
```bash
curl -X PUT http://localhost:5000/api/employees/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "9999999999",
    "department": "Senior Development",
    "is_active": true
  }'
```

**Response:**
```json
{
  "message": "Employee updated successfully"
}
```

### 3.4 Get Employee Report (Admin Only)
**Request:**
```bash
curl -X GET http://localhost:5000/api/employees/2/report \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "report": {
    "id": 2,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "total_tasks": 10,
    "completed_tasks": 3,
    "in_progress_tasks": 5,
    "pending_tasks": 2,
    "urgent_tasks": 1,
    "high_priority_tasks": 3
  }
}
```

## Testing with Postman

### Import as Postman Collection

Create a new Postman collection with these requests:

1. **Create Environment Variable**
   - Variable: `token`
   - Value: (populate after login)
   - Variable: `baseUrl`
   - Value: `http://localhost:5000`

2. **Login Request**
   - After login, set token from response using:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

3. **Use in Headers**
   ```
   Authorization: Bearer {{token}}
   ```

## Common Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid token or credentials |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database connection error |

## Error Responses

### Invalid Credentials
```json
{
  "message": "Invalid email or password"
}
```

### Missing Token
```json
{
  "message": "No token provided"
}
```

### Invalid Token
```json
{
  "message": "Invalid token"
}
```

### Insufficient Permissions
```json
{
  "message": "Admin access required"
}
```

### Resource Not Found
```json
{
  "message": "Task not found"
}
```

## Testing Workflow

1. **Register a new user**
   - POST /api/auth/register

2. **Login**
   - POST /api/auth/login
   - Save the token

3. **Get profile**
   - GET /api/auth/profile
   - Include token in header

4. **Get dashboard stats**
   - GET /api/tasks/dashboard-stats

5. **View tasks**
   - GET /api/tasks/my-tasks (employee)
   - GET /api/tasks/ (admin)

6. **Update task status**
   - PUT /api/tasks/1
   - Change status to "completed"

7. **Get employee list**
   - GET /api/employees/ (admin only)

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding:
- Express rate limit middleware
- Redis for tracking requests
- IP-based or token-based limits

## Security Testing

### Test JWT Expiration
- Login and note expiration time (7 days)
- Token expires after 7 days
- Need to re-login for new token

### Test Role-Based Access
- Admin can access all endpoints
- Employee can only access their own data
- Attempt admin endpoint as employee (should get 403)

### Test SQL Injection
- API uses prepared statements
- All user input is parameterized
- Safe from injection attacks

---

**Last Updated:** February 13, 2026
