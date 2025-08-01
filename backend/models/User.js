const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['staff', 'supervisor', 'admin'], default: 'staff' },
  jobTitle: String,
  isVerified: { type: Boolean, default: false },
  googleId: String,
  contactInfo: String,
  address: String,
  contractStartDate: Date,
  contractEndDate: Date,
  status: String,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
});

module.exports = mongoose.model('User', userSchema);