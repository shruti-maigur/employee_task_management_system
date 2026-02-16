# Project Setup & Installation Guide

## Complete Setup Instructions

### Step 1: Prerequisites Installation

Make sure you have installed:
- **Node.js** (v14+): https://nodejs.org/
- **MySQL Server** (v8+): https://dev.mysql.com/downloads/mysql/
- **Git**: https://git-scm.com/

Verify installations:
```bash
node --version
npm --version
mysql --version
```

### Step 2: Database Setup

#### Option A: Using Command Line
```bash
# Open MySQL command line
mysql -u root -p

# In MySQL prompt:
source /path/to/backend/db/schema.sql;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new connection to localhost
3. Open File > Open SQL Script
4. Select `backend/db/schema.sql`
5. Execute the script (Ctrl + Shift + Enter)

#### Insert Sample Data (Optional)
```bash
mysql -u root -p employee_task_db < backend/db/sample_data.sql
```

Verify database creation:
```bash
mysql -u root -p
SHOW DATABASES;
USE employee_task_db;
SHOW TABLES;
```

### Step 3: Backend Configuration

#### 3.1 Navigate to backend
```bash
cd backend
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Create .env file
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
# Using Notepad (Windows):
notepad .env

# Using Vi (Mac/Linux):
vi .env
```

#### 3.4 Configure .env
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_task_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

#### 3.5 Start backend server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
Server is running on port 5000
```

### Step 4: Frontend Configuration

#### 4.1 Open new terminal, navigate to frontend
```bash
cd frontend
```

#### 4.2 Install dependencies
```bash
npm install
```

#### 4.3 Start React development server
```bash
npm start
```

The app will automatically open at `http://localhost:3000`

### Step 5: Test the Application

#### 5.1 Login with demo credentials
- **Admin Account:**
  - Email: `admin@company.com`
  - Password: `admin123`

- **Employee Account:**
  - Email: `john@company.com`
  - Password: `emp123`

#### 5.2 Test admin features
- Go to Dashboard
- Navigate to "Tasks" menu
- Create a new task
- Assign to an employee
- View employees

#### 5.3 Test employee features
- Logout and login as employee
- View "My Tasks"
- Update task status
- View profile

## Terminal Commands Reference

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server (with auto-restart)
npm run dev

# Start production server
npm start

# Install a specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Create production build
npm build

# Run tests
npm test

# Run and eject (one-way operation)
npm eject
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root -p

# Import schema
mysql -u root -p employee_task_db < db/schema.sql

# Import sample data
mysql -u root -p employee_task_db < db/sample_data.sql

# Backup database
mysqldump -u root -p employee_task_db > backup.sql

# Restore database
mysql -u root -p employee_task_db < backup.sql
```

## MySQL Setup Detailed Guide

### Windows MySQL Installation
1. Download MySQL from https://dev.mysql.com/downloads/mysql/
2. Run installer
3. Choose Setup Type: "Developer Default"
4. Accept defaults through configuration
5. Configure MySQL Server:
   - Port: 3306
   - Config Type: Development Machine
   - Run as service: Windows Service
6. Complete installation
7. Open Command Prompt:
   ```
   mysql -u root -p
   Enter password: (password set during installation)
   ```

### Mac MySQL Installation
```bash
# Using Homebrew
brew install mysql

# Start MySQL
brew services start mysql

# Connect
mysql -u root
```

### Linux MySQL Installation
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL
sudo service mysql start

# Connect
mysql -u root -p
```

## VS Code Setup (Recommended)

### 1. Install Extensions
- ES7+ React/Redux/React-Native snippets
- MySQL
- REST Client
- Thunder Client (API testing)

### 2. Open Project
```bash
code .
```

### 3. Install backend and frontend extensions
- Open terminal in VS Code
- Backend terminal: `cd backend && npm install`
- Frontend terminal: `cd frontend && npm install`

### 4. Start both servers
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm start`

## Troubleshooting Detailed

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
cd backend
npm install
```

### Issue: "MySQL Error: Access denied for user 'root'@'localhost'"
**Solution:**
1. Verify MySQL is running
2. Check password in .env matches MySQL password
3. Reset MySQL password:
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   ```

### Issue: "Port 3000 is already in use"
**Solution Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Solution Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "CORS error - blocked by CORS policy"
**Solution:**
1. Ensure backend is running
2. Check CORS is enabled in backend/server.js
3. Verify frontend proxy in frontend/package.json:
   ```json
   "proxy": "http://localhost:5000"
   ```

### Issue: "Database tables don't exist"
**Solution:**
```bash
# Re-run schema
mysql -u root -p employee_task_db < backend/db/schema.sql

# Verify tables
mysql -u root -p
USE employee_task_db;
SHOW TABLES;
```

## File Permissions

If you get permission errors on Mac/Linux:

```bash
# Give execute permission to bash scripts
chmod +x ./scripts/*.sh

# Give read/write permission to directories
chmod -R 755 frontend/
chmod -R 755 backend/
```

## Environment Variables Checklist

### Backend .env
- [ ] PORT is set (default: 5000)
- [ ] DB_HOST is correct (default: localhost)
- [ ] DB_USER matches MySQL user
- [ ] DB_PASSWORD matches MySQL password
- [ ] DB_NAME is correct (employee_task_db)
- [ ] JWT_SECRET is set (change in production)
- [ ] NODE_ENV is set (development or production)

## Network Configuration

### If accessing from another machine:

1. **Backend**: In .env, change:
   ```
   DB_HOST=0.0.0.0
   ```

2. **Frontend**: Update API base URL in pages to use server IP:
   ```
   http://192.168.x.x:5000
   ```

## Docker Setup (Optional)

### Create docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: employee_task_db
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    environment:
      DB_HOST: mysql
      DB_PASSWORD: password

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Run with:
```bash
docker-compose up
```

## Verification Checklist

- [ ] MySQL is installed and running
- [ ] Node.js is installed (v14+)
- [ ] `backend/.env` is created with correct credentials
- [ ] `backend/node_modules` exists
- [ ] `frontend/node_modules` exists
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with demo credentials
- [ ] Dashboard loads successfully
- [ ] Can create a task (admin)
- [ ] Can view task list (any user)

## Next Steps

1. Read the complete [README_FULL.md](README_FULL.md)
2. Review the [QUICK_START.md](QUICK_START.md)
3. Check [DOCUMENTATION.html](DOCUMENTATION.html) for API reference
4. Explore the codebase structure
5. Customize for your needs

## Support Resources

- Node.js Documentation: https://nodejs.org/en/docs/
- React Documentation: https://react.dev/
- Express.js Documentation: https://expressjs.com/
- MySQL Documentation: https://dev.mysql.com/doc/
- JWT Documentation: https://jwt.io/

---

**Need Help?**
1. Check error messages carefully
2. Verify all prerequisites are installed
3. Follow installation steps in order
4. Restart servers after configuration changes
5. Clear browser cache if frontend issues occur

Last Updated: February 13, 2026
