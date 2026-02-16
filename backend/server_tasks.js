// ============================================================
// Express Server with Task CRUD Endpoints
// File: backend/server_tasks.js
// ============================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db_tasks');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================
// ROUTES
// ============================================================

/**
 * GET /api/tasks
 * Fetch all tasks
 */
app.get('/api/tasks', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tasks] = await connection.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    connection.release();

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks
    });
  } catch (error) {
    console.error('GET /api/tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks',
      error: error.message
    });
  }
});

/**
 * GET /api/tasks/:id
 * Fetch single task by ID
 */
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const connection = await pool.getConnection();
    const [tasks] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    connection.release();

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: tasks[0]
    });
  } catch (error) {
    console.error('GET /api/tasks/:id Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving task',
      error: error.message
    });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 * Body: { title: string, description: string, status: string }
 */
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 255 characters'
      });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'Pending';

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
      [title.trim(), description ? description.trim() : null, taskStatus]
    );
    connection.release();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        id: result.insertId,
        title: title.trim(),
        description: description ? description.trim() : null,
        status: taskStatus,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('POST /api/tasks Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 * Body: { title?: string, description?: string, status?: string }
 */
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    // Check if task exists
    const connection = await pool.getConnection();
    const [existingTask] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (existingTask.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Prepare update data
    const updates = {};
    const values = [];

    if (title !== undefined) {
      if (title.trim().length === 0) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        });
      }
      if (title.length > 255) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Task title cannot exceed 255 characters'
        });
      }
      updates.title = true;
      values.push(title.trim());
    }

    if (description !== undefined) {
      updates.description = true;
      values.push(description ? description.trim() : null);
    }

    if (status !== undefined) {
      const validStatuses = ['Pending', 'In Progress', 'Completed'];
      if (!validStatuses.includes(status)) {
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      updates.status = true;
      values.push(status);
    }

    if (Object.keys(updates).length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Build update query
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    values.push(id);

    await connection.query(
      `UPDATE tasks SET ${setClause} WHERE id = ?`,
      values
    );

    // Fetch updated task
    const [updatedTask] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    connection.release();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask[0]
    });
  } catch (error) {
    console.error('PUT /api/tasks/:id Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const connection = await pool.getConnection();

    // Check if task exists
    const [existingTask] = await connection.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (existingTask.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Delete the task
    await connection.query('DELETE FROM tasks WHERE id = ?', [id]);
    connection.release();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    console.error('DELETE /api/tasks/:id Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date()
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * Error Handler Middleware
 */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================================
// START SERVER
// ============================================================

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║       Task Management Server is Running               ║
║                                                       ║
║  Server:  http://localhost:${PORT}                     ║
║  API:     http://localhost:${PORT}/api/tasks           ║
║  Health:  http://localhost:${PORT}/api/health          ║
║  Environment: ${process.env.NODE_ENV || 'development'} ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
