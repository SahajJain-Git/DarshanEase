const express = require('express');
const router  = express.Router();

const {
  getSlots,
  getSlot,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController');
const { protect, adminOnly } = require('../middleware/auth');

// Public (users can browse available slots)
router.get('/',    getSlots);
router.get('/:id', getSlot);

// Admin only
router.post  ('/',    protect, adminOnly, createSlot);
router.put   ('/:id', protect, adminOnly, updateSlot);
router.delete('/:id', protect, adminOnly, deleteSlot);

module.exports = router;