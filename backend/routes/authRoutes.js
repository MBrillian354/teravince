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

// OAuth user data endpoint (for post-OAuth user data retrieval)
router.get('/oauth/user', verifyToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password').populate('jobId', 'title');
    
    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      jobTitle: user.jobId ? user.jobId.title : 'Unassigned',
      jobId: user.jobId ? user.jobId.toString() : null,
      address: user.address,
      contactInfo: user.contactInfo,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified
    };
    
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to retrieve user data' });
  }
});

// ==========================================
// Google OAuth Routes (if configured)
// ==========================================

// Check if Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Initiate Google OAuth
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // Google OAuth callback
  router.get('/google/callback', 
    passport.authenticate('google', {session: false, failureRedirect: '/' }), 
    (req, res) => {
      const token = jwt.sign(
        { id: req.user._id, isVerified: req.user.isVerified, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Prepare user data similar to login response
      const userData = {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        jobTitle: req.user.jobId ? req.user.jobId.title : 'Unassigned',
        jobId: req.user.jobId ? req.user.jobId.toString() : null,
        address: req.user.address,
        contactInfo: req.user.contactInfo,
        profilePicture: req.user.profilePicture,
        isVerified: req.user.isVerified
      };
      
      // Encode user data as base64 to include in URL
      const encodedUserData = Buffer.from(JSON.stringify(userData)).toString('base64');
      
      res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${encodedUserData}`);
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
