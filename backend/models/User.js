const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['staff', 'supervisor', 'admin'], required: false },
  position: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  googleId: String,
  contactInfo: String,
  address: String,
  profilePicture: { type: String, default: '' },
  contractStartDate: Date,
  contractEndDate: Date,
  status: { type: String, default: 'continue' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
});

module.exports = mongoose.model('User', userSchema);