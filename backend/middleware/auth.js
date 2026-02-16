const jwt = require('jsonwebtoken');
const { ROLES } = require('../config/constants');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

const managerMiddleware = (req, res, next) => {
  if (req.user && req.user.role === ROLES.MANAGER) {
    next();
  } else {
    res.status(403).json({ message: 'Manager access required' });
  }
};

const employeeMiddleware = (req, res, next) => {
  if (req.user && (req.user.role === ROLES.EMPLOYEE || req.user.role === ROLES.ADMIN || req.user.role === ROLES.MANAGER)) {
    next();
  } else {
    res.status(403).json({ message: 'Employee access required' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  managerMiddleware,
  employeeMiddleware
};
