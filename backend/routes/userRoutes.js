const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Get all users
router.get('/', verifyToken, usersController.getAllUsers);

// Get user by ID
router.get('/:id', verifyToken, usersController.getUserById);

// Create new user
router.post('/', verifyToken, usersController.createUser);

// Update user
router.put('/:id', verifyToken, usersController.updateUser);

// Upload user profilePicture
router.post('/:id/profilePicture', verifyToken, upload.single('profilePicture'), usersController.uploadPhoto);

// Delete user
router.delete('/:id', verifyToken, usersController.deleteUser);

module.exports = router;
