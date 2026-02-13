const pool = require('../config/database');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [employees] = await conn.query(
      'SELECT id, first_name, last_name, email, phone, department, role, is_active FROM users WHERE role = "employee" OR role = "admin"'
    );
    conn.release();

    res.status(200).json({ employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    
    const [employees] = await conn.query(
      'SELECT id, first_name, last_name, email, phone, department, role, is_active FROM users WHERE id = ?',
      [id]
    );

    if (employees.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Get employee tasks
    const [tasks] = await conn.query(
      'SELECT id, title, status, priority, deadline FROM tasks WHERE assigned_to = ?',
      [id]
    );

    conn.release();

    res.status(200).json({
      employee: employees[0],
      tasks
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, department, is_active } = req.body;

    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, department = ?, is_active = ? WHERE id = ?',
      [first_name, last_name, phone, department, is_active, id]
    );

    conn.release();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get employee report
const getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const conn = await pool.getConnection();

    const [report] = await conn.query(`
      SELECT 
        u.id, u.first_name, u.last_name, u.email,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
        SUM(CASE WHEN t.priority = 'urgent' THEN 1 ELSE 0 END) as urgent_tasks,
        SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) as high_priority_tasks
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to
      WHERE u.id = ? AND u.role = 'employee'
      GROUP BY u.id
    `, [employeeId]);

    conn.release();

    if (report.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ report: report[0] });
  } catch (error) {
    console.error('Get employee report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getEmployeeReport
};
