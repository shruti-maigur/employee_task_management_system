const pool = require('../config/database');
const { TASK_STATUS } = require('../config/constants');

// Get all tasks (with filters)
const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, createdBy } = req.query;
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (assignedTo) {
      query += ' AND assigned_to = ?';
      params.push(assignedTo);
    }
    if (createdBy) {
      query += ' AND created_by = ?';
      params.push(createdBy);
    }

    query += ' ORDER BY deadline ASC, priority DESC';

    const conn = await pool.getConnection();
    const [tasks] = await conn.query(query, params);
    conn.release();

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    const [tasks] = await conn.query(
      'SELECT t.*, u.first_name, u.last_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?',
      [id]
    );

    if (tasks.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get task comments
    const [comments] = await conn.query(
      'SELECT c.*, u.first_name, u.last_name FROM task_comments c JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC',
      [id]
    );

    conn.release();

    res.status(200).json({
      task: {
        ...tasks[0],
        comments
      }
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assigned_to } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const conn = await pool.getConnection();

    const [result] = await conn.query(
      'INSERT INTO tasks (title, description, priority, deadline, assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, priority || 'medium', deadline, assigned_to || null, userId, 'pending']
    );

    conn.release();

    res.status(201).json({
      message: 'Task created successfully',
      taskId: result.insertId
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, deadline, assigned_to, progress } = req.body;

    const conn = await pool.getConnection();

    // Check if task exists
    const [tasks] = await conn.query('SELECT id FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Task not found' });
    }

    let query = 'UPDATE tasks SET ';
    const params = [];
    const updates = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
      if (status === 'completed') {
        updates.push('completed_at = NOW()');
      }
    }
    if (deadline !== undefined) {
      updates.push('deadline = ?');
      params.push(deadline);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }
    if (progress !== undefined) {
      updates.push('progress = ?');
      params.push(progress);
    }

    if (updates.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'No fields to update' });
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await conn.query(query, params);
    conn.release();

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    const [tasks] = await conn.query('SELECT id FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Task not found' });
    }

    await conn.query('DELETE FROM tasks WHERE id = ?', [id]);
    conn.release();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user tasks
const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = 'SELECT * FROM tasks WHERE assigned_to = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY deadline ASC, priority DESC';

    const conn = await pool.getConnection();
    const [tasks] = await conn.query(query, params);
    conn.release();

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment to task
const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const conn = await pool.getConnection();

    const [result] = await conn.query(
      'INSERT INTO task_comments (task_id, user_id, comment) VALUES (?, ?, ?)',
      [taskId, userId, comment]
    );

    conn.release();

    res.status(201).json({
      message: 'Comment added successfully',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const userId = req.user.id;

    let statsQuery = '';
    let statsParams = [];

    if (req.user.role === 'admin') {
      statsQuery = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
          COUNT(DISTINCT assigned_to) as total_employees
        FROM tasks
      `;
    } else {
      statsQuery = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
        FROM tasks
        WHERE assigned_to = ?
      `;
      statsParams = [userId];
    }

    const [stats] = await conn.query(statsQuery, statsParams);
    conn.release();

    res.status(200).json({ stats: stats[0] });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
