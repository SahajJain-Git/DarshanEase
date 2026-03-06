const express = require('express');
const router  = express.Router();

const { getUsers, toggleUser, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes in this file require admin access
router.use(protect, adminOnly);

router.get   ('/users',            getUsers);    // List all devotees
router.put   ('/users/:id/toggle', toggleUser);  // Activate / deactivate
router.delete('/users/:id',        deleteUser);  // Permanently delete

module.exports = router;