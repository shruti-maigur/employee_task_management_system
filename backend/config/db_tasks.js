// ============================================================
// Database Configuration
// File: backend/config/db.js
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Database Connected Successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err);
    process.exit(1);
  });

module.exports = pool;
