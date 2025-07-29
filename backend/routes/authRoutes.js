const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

// Manual Auth
router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Google Auth
router.post('/google-login', authController.googleLogin);

// Protected Route Example
router.get('/me', verifyToken, authController.getUserData);

module.exports = router;
