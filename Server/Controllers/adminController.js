const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all devotee (non-admin) accounts
// @access  Admin
// ─────────────────────────────────────────────────────────────
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/admin/users/:id/toggle
// @desc    Toggle a user's active/inactive status
// @access  Admin
// ─────────────────────────────────────────────────────────────
const toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   DELETE /api/admin/users/:id
// @desc    Permanently delete a user account
// @access  Admin
// ─────────────────────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, toggleUser, deleteUser };