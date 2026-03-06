const mongoose = require('mongoose');

/**
 * Booking Schema
 * Links a User to a DarshanSlot (and its Temple).
 * Tracks payment, status, number of devotees, and donation.
 */
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: [true, 'Slot reference is required'],
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    // Number of devotees in this booking (1–10)
    devotees: {
      type: Number,
      required: true,
      min: [1,  'At least 1 devotee required'],
      max: [10, 'Max 10 devotees per booking'],
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    donationAmount: {
      type: Number,
      default: 0,
    },
    // Human-readable unique booking reference
    bookingId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'free'],
      default: 'free',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded'],
      default: 'paid',
    },
    specialRequests: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// ── Auto-generate booking ID before first save ────────────────
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingId = `DE${ts}${rnd}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);