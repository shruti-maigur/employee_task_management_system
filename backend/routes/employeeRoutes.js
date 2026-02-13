const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all employees (admin only)
router.get('/', authMiddleware, adminMiddleware, employeeController.getAllEmployees);

// Get employee by ID (admin only)
router.get('/:id', authMiddleware, adminMiddleware, employeeController.getEmployeeById);

// Update employee (admin only)
router.put('/:id', authMiddleware, adminMiddleware, employeeController.updateEmployee);

// Get employee report (admin only)
router.get('/:employeeId/report', authMiddleware, adminMiddleware, employeeController.getEmployeeReport);

module.exports = router;
