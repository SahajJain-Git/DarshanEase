const DarshanSlot = require('../models/DarshanSlot');

// ─────────────────────────────────────────────────────────────
// @route   GET /api/slots?templeId=&date=
// @desc    List slots, optionally filtered by temple and/or date
// @access  Public
// ─────────────────────────────────────────────────────────────
const getSlots = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.templeId) filter.temple    = req.query.templeId;
    if (req.query.date)     filter.date      = req.query.date;
    if (req.user?.role !== 'admin') filter.isActive = true;

    const slots = await DarshanSlot.find(filter)
      .populate('temple', 'name location emoji')
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, count: slots.length, slots });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/slots/:id
// @desc    Get a single slot with its temple details
// @access  Public
// ─────────────────────────────────────────────────────────────
const getSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id)
      .populate('temple');

    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, slot });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/slots
// @desc    Create a new darshan slot
// @access  Admin
// ─────────────────────────────────────────────────────────────
const createSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.create(req.body);

    // Populate temple for a useful response
    const populated = await slot.populate('temple', 'name location emoji');

    res.status(201).json({
      success: true,
      message: 'Slot created',
      slot: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/slots/:id
// @desc    Update a darshan slot
// @access  Admin
// ─────────────────────────────────────────────────────────────
const updateSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('temple', 'name location emoji');

    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, message: 'Slot updated', slot });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   DELETE /api/slots/:id
// @desc    Deactivate a slot
// @access  Admin
// ─────────────────────────────────────────────────────────────
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, message: 'Slot deactivated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSlots, getSlot, createSlot, updateSlot, deleteSlot };