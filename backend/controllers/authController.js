const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Register
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, department } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const conn = await pool.getConnection();
    
    // Check if user already exists
    const [existingUser] = await conn.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      conn.release();
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await conn.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, department, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone, department, 'employee']
    );

    conn.release();

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const conn = await pool.getConnection();
    
    const [users] = await conn.query(
      'SELECT id, first_name, last_name, email, password, role, is_active FROM users WHERE email = ?',
      [email]
    );

    conn.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ message: 'User account is inactive' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const conn = await pool.getConnection();
    
    const [users] = await conn.query(
      'SELECT id, first_name, last_name, email, phone, role, department, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, phone, department } = req.body;

    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, department = ? WHERE id = ?',
      [first_name, last_name, phone, department, userId]
    );

    conn.release();

    res.status(200).json({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot Password (Generate Reset Token)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const conn = await pool.getConnection();
    
    const [users] = await conn.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = users[0].id;
    const resetToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to database
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
    
    await conn.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, resetToken, expiresAt]
    );

    conn.release();

    // In production, send email with reset link
    // For now, we'll return the token for testing
    res.status(200).json({
      message: 'Password reset token sent to email',
      token: resetToken // Remove this in production
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const conn = await pool.getConnection();
    
    // Check if token exists and is valid
    const [resetTokens] = await conn.query(
      'SELECT id FROM password_resets WHERE token = ? AND expires_at > NOW() AND is_used = FALSE',
      [token]
    );

    if (resetTokens.length === 0) {
      conn.release();
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await conn.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );

    // Mark token as used
    await conn.query(
      'UPDATE password_resets SET is_used = TRUE WHERE token = ?',
      [token]
    );

    conn.release();

    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
};
