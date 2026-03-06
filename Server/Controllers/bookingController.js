const Booking     = require('../models/Booking');
const DarshanSlot = require('../models/DarshanSlot');

// ─────────────────────────────────────────────────────────────
// @route   POST /api/bookings
// @desc    Create a new darshan booking
// @access  Private (user)
// ─────────────────────────────────────────────────────────────
const createBooking = async (req, res, next) => {
  try {
    const {
      slotId,
      templeId,
      devotees,
      donationAmount,
      paymentMethod,
      specialRequests,
    } = req.body;

    // Fetch the slot
    const slot = await DarshanSlot.findById(slotId);
    if (!slot || !slot.isActive) {
      return res
        .status(404)
        .json({ success: false, message: 'Slot not found or inactive' });
    }

    // Check seat availability
    if (slot.availableSeats < devotees) {
      return res.status(400).json({
        success: false,
        message: `Only ${slot.availableSeats} seat(s) available in this slot`,
      });
    }

    // Calculate totals (₹20 service fee)
    const ticketAmount = slot.pricePerDevotee * devotees;
    const totalAmount  = ticketAmount + (donationAmount || 0) + 20;

    // Create booking document
    const booking = await Booking.create({
      user:           req.user._id,
      slot:           slotId,
      temple:         templeId,
      devotees,
      totalAmount,
      donationAmount: donationAmount || 0,
      paymentMethod:  paymentMethod || (slot.pricePerDevotee === 0 ? 'free' : 'card'),
      specialRequests: specialRequests || '',
    });

    // Atomically increment booked seats
    await DarshanSlot.findByIdAndUpdate(slotId, {
      $inc: { bookedSeats: devotees },
    });

    // Return fully populated booking
    const populated = await Booking.findById(booking._id)
      .populate('slot',   'date startTime endTime pricePerDevotee')
      .populate('temple', 'name location emoji deity');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed! 🙏',
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/bookings/my
// @desc    Get all bookings of the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────────
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot',   'date startTime endTime')
      .populate('temple', 'name location emoji deity')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/bookings/:id
// @desc    Get a single booking (owner or admin)
// @access  Private
// ─────────────────────────────────────────────────────────────
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('slot')
      .populate('temple')
      .populate('user', 'name email phone');

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Only the owner or an admin can view this
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking and free up seats
// @access  Private (owner)
// ─────────────────────────────────────────────────────────────
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: 'Booking not found' });
    }

    // Only the owner can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res
        .status(400)
        .json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release seats back to the slot
    await DarshanSlot.findByIdAndUpdate(booking.slot, {
      $inc: { bookedSeats: -booking.devotees },
    });

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/bookings           (admin)
// @desc    Get all bookings in the system
// @access  Admin
// ─────────────────────────────────────────────────────────────
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user',   'name email phone')
      .populate('slot',   'date startTime endTime')
      .populate('temple', 'name location emoji')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/bookings/admin/stats   (admin)
// @desc    Aggregate dashboard statistics
// @access  Admin
// ─────────────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const User   = require('../models/User');
    const Temple = require('../models/Temple');

    const [
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      revenue,
      totalUsers,
      totalTemples,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            total:     { $sum: '$totalAmount' },
            donations: { $sum: '$donationAmount' },
          },
        },
      ]),
      User.countDocuments({ role: 'user' }),
      Temple.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue:   revenue[0]?.total     || 0,
        totalDonations: revenue[0]?.donations || 0,
        totalUsers,
        totalTemples,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  getStats,
};