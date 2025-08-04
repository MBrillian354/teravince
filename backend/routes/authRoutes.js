const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/signup', authController.register); // Add alias for frontend compatibility
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/me', verifyToken, authController.getUserData);

module.exports = router;
