const express = require("express");
const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Bookings route working" });
});

// Admin stats route
router.get("/admin/stats", async (req, res) => {
  try {
    const Booking = require("../models/Booking");

    const totalBookings = await Booking.countDocuments();

    const stats = {
      totalBookings,
      todayBookings: 0,
      totalRevenue: 0
    };

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;