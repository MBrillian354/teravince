const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');

// Get all users
router.get('/', verifyToken, usersController.getAllUsers);

// Get user by ID
router.get('/:id', verifyToken, usersController.getUserById);

// Create new user
router.post('/', verifyToken, usersController.createUser);

// Update user
router.put('/:id', verifyToken, usersController.updateUser);

// Delete user
router.delete('/:id', verifyToken, usersController.deleteUser);

module.exports = router;
