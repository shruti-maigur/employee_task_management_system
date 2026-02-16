# Quick Start Guide

## Setup Instructions

### 1. Database Setup
```bash
# Open MySQL
mysql -u root -p

# Create database
source backend/db/schema.sql;

# Insert sample data (optional)
source backend/db/sample_data.sql;
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_PASSWORD=your_mysql_password

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The frontend will open automatically at `http://localhost:3000`

## Test Credentials

**Admin Login:**
- Email: `admin@company.com`
- Password: `admin123`

**Employee Login:**
- Email: `john@company.com`
- Password: `emp123`

## API Test (Using curl or Postman)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "department": "Engineering"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "admin123"
  }'
```

### Get All Tasks (Requires Token)
```bash
curl -X GET http://localhost:5000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

1. **MySQL Connection Error**
   - Check MySQL is running
   - Verify credentials in `.env`
   - Run: `mysql -u root -p` to test connection

2. **Port Already in Use**
   - Backend default: 5000
   - Frontend default: 3000
   - Change in .env or kill process on that port

3. **CORS Error**
   - Ensure backend is running before frontend
   - Check proxy in frontend/package.json points to backend URL

## Useful npm Scripts

### Backend
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

### Frontend
- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests

## File Structure Summary

```
backend/
  ├── server.js          # Main entry point
  ├── config/            # Database & constants
  ├── middleware/        # Auth middleware
  ├── controllers/       # Business logic
  ├── routes/            # API endpoints
  └── db/                # Database schema & sample data

frontend/
  ├── src/
  │   ├── pages/         # Page components
  │   ├── components/    # Reusable components
  │   ├── context/       # React context
  │   ├── styles/        # CSS files
  │   └── App.js         # Root component
  └── public/            # Static files
```

## Next Steps

1. Explore the admin dashboard
2. Create new tasks
3. Assign tasks to employees
4. Update task status
5. View employee reports

For detailed documentation, see README.md
