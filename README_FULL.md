# Employee Task Management System

A complete full-stack web application for managing employee tasks efficiently. This system provides role-based access control, task management features, and comprehensive dashboards.

**Quick Start Demo Credentials:**
- Admin: `admin@company.com` / `admin123`
- Employee: `john@company.com` / `emp123`

## Features

- **User Authentication**
  - Register, Login, Logout
  - Forgot Password functionality
  - JWT-based secure authentication

- **Role-Based Access Control**
  - **Admin**: Manage employees, assign tasks, update task status, view reports
  - **Employee**: View assigned tasks, update progress, mark tasks as complete

- **Task Management**
  - Create, edit, delete, and assign tasks
  - Task fields: title, description, priority, deadline, status, assigned employee
  - Task status tracking (pending, in progress, completed, cancelled)
  - Task priority levels (low, medium, high, urgent)
  - Task comments for collaboration

- **Dashboard**
  - Task statistics and summary
  - Employee overview (admin only)
  - Quick action buttons
  - Real-time task counts

- **Responsive UI**
  - Mobile-friendly design
  - Responsive dashboard, task lists, and forms
  - Reusable Header, Sidebar, and Footer components
  - Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React.js 18 with Hooks
- React Router v6 for navigation
- CSS3 with responsive design
- Axios for HTTP requests

### Backend
- Node.js with Express.js
- MySQL 8+ database
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

### Database
- MySQL 8+
- Relational schema with proper indexes
- 6 main tables with relationships

## Project Structure

```
employee_task_management_system/
│
├── backend/
│   ├── config/
│   │   ├── database.js          # MySQL pool configuration
│   │   └── constants.js         # App-wide constants
│   ├── middleware/
│   │   └── auth.js              # JWT authentication & role middleware
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   └── employeeController.js # Employee management
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   └── employeeRoutes.js    # Employee endpoints
│   ├── db/
│   │   ├── schema.sql           # Database schema
│   │   └── sample_data.sql      # Sample data
│   ├── package.json
│   ├── server.js                # Express app entry point
│   └── .env.example             # Environment template
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.js        # Navigation header
    │   │   ├── Sidebar.js       # Navigation sidebar
    │   │   └── Footer.js        # Footer component
    │   ├── pages/
    │   │   ├── Login.js         # Login page
    │   │   ├── Register.js      # Registration page
    │   │   ├── ForgotPassword.js # Password recovery
    │   │   ├── Dashboard.js     # Main dashboard
    │   │   ├── TaskList.js      # Task management
    │   │   ├── Profile.js       # User profile
    │   │   └── Employees.js     # Employee directory
    │   ├── context/
    │   │   ├── AuthContext.js   # Auth state management
    │   │   └── ProtectedRoute.js # Route protection
    │   ├── styles/
    │   │   ├── Global.css       # Global styles
    │   │   ├── Auth.css         # Auth pages
    │   │   ├── Header.css       # Header styles
    │   │   ├── Sidebar.css      # Sidebar styles
    │   │   ├── Footer.css       # Footer styles
    │   │   ├── Dashboard.css    # Dashboard styles
    │   │   ├── TaskList.css     # Task list styles
    │   │   ├── Profile.css      # Profile styles
    │   │   └── Employees.css    # Employees styles
    │   ├── App.js               # Main app component
    │   └── index.js             # React entry point
    ├── public/
    │   └── index.html           # HTML template
    └── package.json
```

## Database Schema

### Tables
1. **users** - User accounts and profiles
2. **tasks** - Task records
3. **task_comments** - Task discussion threads
4. **task_attachments** - File attachments
5. **password_resets** - Password recovery tokens
6. Indexes on commonly queried fields

## Installation & Setup

### Prerequisites
- Node.js v14 or higher
- npm or yarn
- MySQL Server v8 or higher
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create MySQL database:**
   ```bash
   mysql -u root -p < db/schema.sql
   ```

4. **Insert sample data (optional):**
   ```bash
   mysql -u root -p employee_task_db < db/sample_data.sql
   ```

5. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=employee_task_db
   JWT_SECRET=your_very_secret_key_change_this
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

6. **Start backend server:**
   ```bash
   npm run dev
   ```
   Backend runs at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   Frontend opens at `http://localhost:3000`

## Default Test Accounts

**Admin Account:**
- Email: `admin@company.com`
- Password: `admin123`

**Employee Accounts:**
- John Doe: `john@company.com` / `emp123`
- Jane Smith: `jane@company.com` / `emp123`
- Bob Johnson: `bob@company.com` / `emp123`

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login user
POST   /api/auth/forgot-password       - Request password reset
POST   /api/auth/reset-password        - Reset password
GET    /api/auth/profile               - Get user profile (protected)
PUT    /api/auth/profile               - Update user profile (protected)
```

### Task Endpoints
```
GET    /api/tasks/dashboard-stats      - Get task statistics (protected)
GET    /api/tasks/my-tasks             - Get user's assigned tasks (protected)
GET    /api/tasks/                     - Get all tasks (admin only)
GET    /api/tasks/:id                  - Get task details (protected)
POST   /api/tasks/                     - Create new task (admin only)
PUT    /api/tasks/:id                  - Update task (protected)
DELETE /api/tasks/:id                  - Delete task (admin only)
POST   /api/tasks/:taskId/comments     - Add comment to task (protected)
```

### Employee Endpoints
```
GET    /api/employees/                 - Get all employees (admin only)
GET    /api/employees/:id              - Get employee details (admin only)
PUT    /api/employees/:id              - Update employee (admin only)
GET    /api/employees/:employeeId/report - Get employee performance report (admin only)
```

## Authentication Flow

1. User registers with email and password
2. Password hashed with bcryptjs (10 salt rounds)
3. User logs in with credentials
4. Server generates JWT token (7-day expiration)
5. Token stored in browser localStorage
6. Token sent in Authorization header for API requests
7. Middleware verifies token on protected routes
8. User logged out on token expiration

## Security Features

- Password hashing: bcryptjs with 10 salt rounds
- JWT token authentication
- Role-based access control (RBAC)
- Protected API routes with middleware
- SQL prepared statements
- CORS configuration
- Environment variables for secrets
- Session token expiration

## Features Walkthrough

### Admin Features
- Create and assign tasks to employees
- Edit task details and status
- Delete tasks
- View all employees and their task statistics
- Generate employee performance reports
- Manage user accounts
- View system-wide task dashboard

### Employee Features
- View assigned tasks
- Update task progress
- Change task status (in progress, completed, etc.)
- Add comments to tasks
- Update personal profile
- View personal task statistics
- Track task deadlines

## Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop/Tablets (1024px - 1919px)
- Tablets (768px - 1023px)
- Mobile phones (below 768px)

Mobile optimization includes:
- Collapsible sidebar
- Touch-friendly buttons
- Responsive tables
- Optimized form layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Ensure MySQL is running
- Verify DB credentials in .env
- Check database name

### Backend won't start
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in .env
- Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### Frontend can't reach backend
```
Failed to fetch from http://localhost:5000
```
**Solution:**
- Ensure backend server is running
- Check proxy in frontend/package.json
- Verify CORS settings in server.js

### Login fails with valid credentials
**Solution:**
- Verify user exists in database
- Check user is_active = TRUE
- Ensure password was hashed correctly

## Performance Optimization

- Database indexes on frequently queried columns
- Pagination ready for large datasets
- Optimized CSS with minification in production
- Lazy loading for components
- Efficient state management with React Context

## Future Enhancement Ideas

1. Email notifications for task assignments
2. Advanced filtering and search
3. Task templates and automation
4. Calendar view for deadlines
5. Time tracking per task
6. Team collaboration features
7. File attachments and sharing
8. Advanced reporting and analytics
9. Mobile app (React Native)
10. Docker containerization
11. CI/CD pipeline
12. Redis caching

## Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
npm run build
# Deploy the build/ folder
```

### Backend Deployment (Heroku/AWS)
```bash
# Set environment variables in platform
git push heroku main
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support & Contact

For issues, questions, or suggestions:
- Create an issue in the repository
- Check documentation
- Review sample data setup

---

**Version:** 1.0.0  
**Last Updated:** February 13, 2026  
**Node Version:** 14+  
**MySQL Version:** 8+  
**React Version:** 18+  
