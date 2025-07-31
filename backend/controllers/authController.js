const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const name = `${firstName} ${lastName}`;

    const allowedRoles = ['staff', 'supervisor', 'HRD'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email already in use' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: 'Password must be at least 8 characters long, include uppercase, lowercase, number and symbol.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email,
      password: hashedPassword,
      name,
      role
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendEmail(
      email,
      'Email Verification',
      `<h2>Hi ${name}</h2><p>Please click the link below to verify your account:</p><a href="${url}">${url}</a>`
    );

    res.status(200).json({ msg: 'Registration successful! Check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(id, { isVerified: true });
    if (!user) return res.status(404).send('User not found.');
    res.send('Email verified!');
  } catch (err) {
    res.status(400).send('Invalid or expired link.');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, isVerified: user.isVerified, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Login failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      email,
      'Reset Password',
      `<h2>Hi ${user.name}</h2><p>Click the following link to reset your password:</p><a href="${url}">${url}</a>`
    );

    res.status(200).json({ msg: 'Password reset link sent to email.' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to send password reset link' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    res.json({ msg: 'Password changed successfully!' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve user data' });
  }
};
