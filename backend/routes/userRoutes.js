const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// ==========================================
// User Management Routes (Admin/Manager)
// ==========================================

// Get all users - Admin/Manager only
router.get('/', verifyToken, usersController.getAllUsers);

// Create new user - Admin/Manager only
router.post('/', verifyToken, usersController.createUser);

// ==========================================
// Individual User Routes
// ==========================================

// Get user by ID
router.get('/:id', verifyToken, usersController.getUserById);

// Update user profile/data
router.put('/:id', verifyToken, usersController.updateUser);

// Upload user profile picture
router.post('/:id/profile-picture', verifyToken, upload.single('profilePicture'), usersController.uploadPhoto);

// Delete user - Admin only
router.delete('/:id', verifyToken, usersController.deleteUser);

module.exports = router;
