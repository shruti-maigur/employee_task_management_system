const taskModel = require('../models/taskModel');
const pool = require('../config/database');
const { TASK_STATUS, TASK_PRIORITY, ROLES } = require('../config/constants');

// Get all tasks (with filters) - Admin sees all, Manager sees tasks they created
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;

    // If Manager, show only tasks they created by default
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (assignedTo) filters.assignedTo = assignedTo;

    if (req.user.role === ROLES.MANAGER) {
      filters.createdBy = req.user.id;
    }

    const tasks = await taskModel.getAllTasks(filters);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    const [tasks] = await conn.query(
      'SELECT t.*, CONCAT(u.first_name, " ", u.last_name) as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?',
      [id]
    );

    if (tasks.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get task comments
    const [comments] = await conn.query(
      'SELECT c.*, CONCAT(u.first_name, " ", u.last_name) as user_name FROM task_comments c JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC',
      [id]
    );

    conn.release();

    return res.status(200).json({ task: { ...tasks[0], comments } });
  } catch (error) {
    console.error('Get task by ID error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create task (Admin or Manager)
const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assigned_to } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: 'Task title is required' });

    const p = priority || TASK_PRIORITY.MEDIUM;
    const status = TASK_STATUS.PENDING;

    const result = await taskModel.createTask({ title, description, deadline, priority: p, status, assigned_to, created_by: userId });
    return res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['title', 'description', 'priority', 'status', 'deadline', 'assigned_to', 'progress'];

    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // If status updated to Completed, set completed_at
    if (updates.status === TASK_STATUS.COMPLETED) {
      updates.completed_at = new Date();
    }

    const ok = await taskModel.updateTask(id, updates);
    if (!ok) return res.status(400).json({ message: 'No fields to update' });
    return res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.getTaskById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only Admin or the Manager who created it can delete (enforced in routes via permitRoles + ownership check can be added if needed)
    await taskModel.deleteTask(id);
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user tasks
const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    const tasks = await taskModel.getUserTasks(userId, status);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get user tasks error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment to task
const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment) return res.status(400).json({ message: 'Comment is required' });

    const conn = await pool.getConnection();
    const [result] = await conn.query('INSERT INTO task_comments (task_id, user_id, comment) VALUES (?, ?, ?)', [taskId, userId, comment]);
    conn.release();

    return res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
  } catch (error) {
    console.error('Add comment error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const userId = req.user.id;

    let statsQuery = '';
    let statsParams = [];

    if (req.user.role === ROLES.ADMIN) {
      statsQuery = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
          COUNT(DISTINCT assigned_to) as total_employees
        FROM tasks
      `;
    } else {
      statsQuery = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks
        FROM tasks
        WHERE assigned_to = ?
      `;
      statsParams = [userId];
    }

    const [stats] = await conn.query(statsQuery, statsParams);
    conn.release();

    return res.status(200).json({ stats: stats[0] });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUserTasks,
  addComment,
  getDashboardStats
};
