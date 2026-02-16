const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only)
const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({ message: 'first_name, last_name, email, password and role are required' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    const result = await userModel.createUser({ first_name, last_name, email, password: hashed, role });
    return res.status(201).json({ message: 'User created', userId: result.insertId });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role } = req.body;
    const ok = await userModel.updateUser(id, { first_name, last_name, email, role });
    if (!ok) return res.status(400).json({ message: 'No fields provided' });
    return res.status(200).json({ message: 'User updated' });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.deleteUser(id);
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
