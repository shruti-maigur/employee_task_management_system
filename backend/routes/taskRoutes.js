const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');
const { permitRoles } = require('../middleware/roleMiddleware');

// Get dashboard stats (authenticated users)
router.get('/dashboard-stats', authMiddleware, taskController.getDashboardStats);

// Get user's tasks
router.get('/my-tasks', authMiddleware, taskController.getUserTasks);

// Get all tasks (Admin or Manager)
router.get('/', authMiddleware, permitRoles('Admin', 'Manager'), taskController.getAllTasks);

// Get task by ID (authenticated)
router.get('/:id', authMiddleware, taskController.getTaskById);

// Create task (Admin or Manager)
router.post('/', authMiddleware, permitRoles('Admin', 'Manager'), taskController.createTask);

// Update task (Admin, Manager who created it, or assigned employee can update status)
router.put('/:id', authMiddleware, taskController.updateTask);

// Delete task (Admin or Manager who created it)
router.delete('/:id', authMiddleware, permitRoles('Admin', 'Manager'), taskController.deleteTask);

// Add comment
router.post('/:taskId/comments', authMiddleware, taskController.addComment);

module.exports = router;
