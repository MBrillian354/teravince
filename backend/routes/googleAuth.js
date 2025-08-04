const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, isVerified: req.user.isVerified, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
});

module.exports = router;
