const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['awaitingReview', 'done'],
    default: 'awaitingReview',
  },
  review: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
