const pool = require('../config/database');

// Get all users with role Employee (or all users for admin UI)
const getAllEmployees = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [employees] = await conn.query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY id DESC');
    conn.release();

    res.status(200).json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();

    const [users] = await conn.query('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user tasks
    const [tasks] = await conn.query('SELECT id, title, status, priority, due_date FROM tasks WHERE assigned_to = ?', [id]);

    conn.release();

    res.status(200).json({ user: users[0], tasks });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (admin)
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;

    const conn = await pool.getConnection();
    await conn.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?', [first_name, last_name, email, role, id]);
    conn.release();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user report
const getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const conn = await pool.getConnection();

    const [report] = await conn.query(`
      SELECT 
        u.id, u.first_name, u.last_name, u.email,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pending_tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to
      WHERE u.id = ? AND u.role = 'Employee'
      GROUP BY u.id
    `, [employeeId]);

    conn.release();

    if (report.length === 0) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ report: report[0] });
  } catch (error) {
    console.error('Get employee report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllEmployees, getEmployeeById, updateEmployee, getEmployeeReport };
