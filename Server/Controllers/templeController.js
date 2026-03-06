const Temple = require('../models/Temple');

// ─────────────────────────────────────────────────────────────
// @route   GET /api/temples
// @desc    Get all temples (admins see inactive too)
// @access  Public
// ─────────────────────────────────────────────────────────────
const getTemples = async (req, res, next) => {
  try {
    // Admins see everything; public users see only active temples
    const query = req.user?.role === 'admin' ? {} : { isActive: true };
    const temples = await Temple.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: temples.length, temples });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/temples/:id
// @desc    Get single temple by ID
// @access  Public
// ─────────────────────────────────────────────────────────────
const getTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) {
      return res
        .status(404)
        .json({ success: false, message: 'Temple not found' });
    }
    res.json({ success: true, temple });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/temples
// @desc    Create a new temple
// @access  Admin
// ─────────────────────────────────────────────────────────────
const createTemple = async (req, res, next) => {
  try {
    const temple = await Temple.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Temple created', temple });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/temples/:id
// @desc    Update a temple
// @access  Admin
// ─────────────────────────────────────────────────────────────
const updateTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!temple) {
      return res
        .status(404)
        .json({ success: false, message: 'Temple not found' });
    }
    res.json({ success: true, message: 'Temple updated', temple });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   DELETE /api/temples/:id
// @desc    Soft-delete (deactivate) a temple
// @access  Admin
// ─────────────────────────────────────────────────────────────
const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!temple) {
      return res
        .status(404)
        .json({ success: false, message: 'Temple not found' });
    }
    res.json({ success: true, message: 'Temple deactivated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemples,
  getTemple,
  createTemple,
  updateTemple,
  deleteTemple,
};