const mongoose = require('mongoose');

/**
 * DarshanSlot Schema
 * Each slot belongs to a temple and has a date, start/end time,
 * total seat capacity, and a running count of booked seats.
 */
const darshanSlotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    // ISO date string e.g. "2024-12-25"
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    // "HH:MM" 24-hour format e.g. "05:30"
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'At least 1 seat required'],
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricePerDevotee: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ── Virtual: computed available seats ─────────────────────────
darshanSlotSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.bookedSeats;
});

// Include virtuals when converting to JSON or Object
darshanSlotSchema.set('toJSON',   { virtuals: true });
darshanSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);