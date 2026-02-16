const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const { permitRoles } = require('../middleware/roleMiddleware');

// All routes here are admin-only per spec
router.get('/', authMiddleware, permitRoles('Admin'), userController.getUsers);
router.post('/', authMiddleware, permitRoles('Admin'), userController.createUser);
router.put('/:id', authMiddleware, permitRoles('Admin'), userController.updateUser);
router.delete('/:id', authMiddleware, permitRoles('Admin'), userController.deleteUser);

module.exports = router;
