const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 * Verifies the JWT from the Authorization header.
 * Attaches the fresh user document to req.user.
 * Use on any route that requires a logged-in user.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // Decode and verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user (password excluded)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is deactivated',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — token invalid or expired',
    });
  }
};

/**
 * adminOnly
 * Must be chained AFTER protect.
 * Blocks non-admin users with a 403 Forbidden.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied — admin privileges required',
  });
};

module.exports = { protect, adminOnly };