const pool = require('../config/database');

const createTask = async ({ title, description, deadline, priority = 'Medium', status = 'Pending', assigned_to = null, created_by }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO tasks (title, description, deadline, priority, status, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, deadline, priority, status, assigned_to, created_by]
    );
    return { insertId: result.insertId };
  } finally {
    conn.release();
  }
};

const getTaskById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const getAllTasks = async (filters = {}) => {
  const { status, priority, assignedTo, createdBy } = filters;
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
  try {
    const [rows] = await conn.query(query, params);
    return rows;
  } finally {
    conn.release();
  }
};

const updateTask = async (id, updates = {}) => {
  const conn = await pool.getConnection();
  try {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }

    if (fields.length === 0) return false;

    params.push(id);
    await conn.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, params);
    return true;
  } finally {
    conn.release();
  }
};

const deleteTask = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM tasks WHERE id = ?', [id]);
    return true;
  } finally {
    conn.release();
  }
};

const getUserTasks = async (userId, status) => {
  const conn = await pool.getConnection();
  try {
    let query = 'SELECT * FROM tasks WHERE assigned_to = ?';
    const params = [userId];
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY deadline ASC, priority DESC';
    const [rows] = await conn.query(query, params);
    return rows;
  } finally {
    conn.release();
  }
};

module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  updateTask,
  deleteTask,
  getUserTasks
};
