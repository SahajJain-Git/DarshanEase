const express = require('express');
const router  = express.Router();

const {
  getTemples,
  getTemple,
  createTemple,
  updateTemple,
  deleteTemple,
} = require('../controllers/templeController');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.get('/',    getTemples);
router.get('/:id', getTemple);

// Admin only
router.post  ('/',    protect, adminOnly, createTemple);
router.put   ('/:id', protect, adminOnly, updateTemple);
router.delete('/:id', protect, adminOnly, deleteTemple);

module.exports = router;