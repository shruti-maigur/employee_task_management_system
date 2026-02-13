const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get dashboard stats (both admin and employee)
router.get('/dashboard-stats', authMiddleware, taskController.getDashboardStats);

// Get user's tasks
router.get('/my-tasks', authMiddleware, taskController.getUserTasks);

// Get all tasks (admin only)
router.get('/', authMiddleware, adminMiddleware, taskController.getAllTasks);

// Get task by ID
router.get('/:id', authMiddleware, taskController.getTaskById);

// Create task (admin only)
router.post('/', authMiddleware, adminMiddleware, taskController.createTask);

// Update task
router.put('/:id', authMiddleware, taskController.updateTask);

// Delete task (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, taskController.deleteTask);

// Add comment
router.post('/:taskId/comments', authMiddleware, taskController.addComment);

module.exports = router;
