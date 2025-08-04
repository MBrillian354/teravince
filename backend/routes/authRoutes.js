const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/auth');

// ==========================================
// Authentication Routes
// ==========================================

// Registration routes (with alias for compatibility)
router.post('/register', authController.register);
router.post('/signup', authController.register);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);

// Login routes
router.post('/login', authController.login);

// Password reset routes
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// User profile routes (requires authentication)
router.get('/me', verifyToken, authController.getUserData);

// ==========================================
// Google OAuth Routes (if configured)
// ==========================================

// Check if Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Initiate Google OAuth
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // Google OAuth callback
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
      const token = jwt.sign(
        { id: req.user._id, isVerified: req.user.isVerified, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
    }
  );
} else {
  // Provide informational endpoints when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      msg: 'Google OAuth is not configured. Please contact the administrator.' 
    });
  });

  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      msg: 'Google OAuth is not configured. Please contact the administrator.' 
    });
  });
}

// ==========================================
// Token Management Routes
// ==========================================

// Refresh token (optional - for future implementation)
// router.post('/refresh-token', authController.refreshToken);

// Logout (optional - for future implementation)
// router.post('/logout', verifyToken, authController.logout);

module.exports = router;
