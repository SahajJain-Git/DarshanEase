const mongoose = require('mongoose');

/**
 * Temple Schema
 * Stores details about each temple available for darshan booking.
 */
const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Temple name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    deity: {
      type: String,
      required: [true, 'Deity name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    emoji: {
      type: String,
      default: '🛕',
    },
    // Opening and closing time for darshan (HH:MM format, e.g. "05:00")
    darshanStartTime: {
      type: String,
      required: [true, 'Darshan start time is required'],
    },
    darshanEndTime: {
      type: String,
      required: [true, 'Darshan end time is required'],
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Temple', templeSchema);