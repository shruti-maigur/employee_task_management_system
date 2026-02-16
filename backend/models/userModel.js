const pool = require('../config/database');

const createUser = async ({ first_name, last_name, email, password, role = 'Employee' }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, password, role]
    );
    return { insertId: result.insertId };
  } finally {
    conn.release();
  }
};

const findByEmail = async (email) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const findById = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
};

const getAllUsers = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY id DESC');
    return rows;
  } finally {
    conn.release();
  }
};

const updateUser = async (id, { first_name, last_name, email, role }) => {
  const conn = await pool.getConnection();
  try {
    const fields = [];
    const params = [];
    if (first_name !== undefined) {
      fields.push('first_name = ?');
      params.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push('last_name = ?');
      params.push(last_name);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      params.push(email);
    }
    if (role !== undefined) {
      fields.push('role = ?');
      params.push(role);
    }

    if (fields.length === 0) return false;

    params.push(id);
    await conn.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return true;
  } finally {
    conn.release();
  }
};

const deleteUser = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  } finally {
    conn.release();
  }
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser
};
