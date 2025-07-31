const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: String,
  name: String,
  role: { type: String, enum: ['staff', 'supervisor', 'HRD'], default: 'staff' },
  isVerified: { type: Boolean, default: false },
  googleId: String,
});

module.exports = mongoose.model('User', userSchema);
