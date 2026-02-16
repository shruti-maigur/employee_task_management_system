// Generic role check middleware
const permitRoles = (...allowedRoles) => (req, res, next) => {
  try {
    const { user } = req;
    if (!user || !user.role) return res.status(401).json({ message: 'Unauthorized' });

    if (allowedRoles.includes(user.role)) return next();
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { permitRoles };
